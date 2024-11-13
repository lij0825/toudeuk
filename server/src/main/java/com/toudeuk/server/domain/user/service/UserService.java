package com.toudeuk.server.domain.user.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.toudeuk.server.core.constants.AuthConst;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.domain.game.repository.ClickGameCacheRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRewardLogRepository;
import com.toudeuk.server.domain.user.dto.UserData;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.JwtToken;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.entity.UserItem;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import com.toudeuk.server.domain.user.event.S3UploadEvent;
import com.toudeuk.server.domain.user.event.UserPaymentEvent;
import com.toudeuk.server.domain.user.repository.AuthCacheRepository;
import com.toudeuk.server.domain.user.repository.CashLogRepository;
import com.toudeuk.server.domain.user.repository.UserItemRepository;
import com.toudeuk.server.domain.user.repository.UserRepository;

import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private static final String CLICK_COUNT_KEY = "click:count";
	private static final String NICKNAME_KEY = "nickname:";

	@Resource(name = "redisTemplate")
	private ZSetOperations<String, Object> zSetOperations;

	@Autowired
	public RedisTemplate<String, String> redisTemplate;

	private final JWTService jwtService;
	private final AuthCacheRepository authCacheRepository;
	private final ClickGameCacheRepository clickGameCacheRepository;
	private final UserRepository userRepository;
	private final ClickGameRewardLogRepository clickGameRewardLogRepository;
	private final UserItemRepository userItemRepository;
	private final CashLogRepository cashLogRepository;
	private final ApplicationEventPublisher eventPublisher;

	public List<User> findAll() {
		return userRepository.findAll();
	}

	public UserData.Info getUserInfo(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
		Integer userCash = clickGameCacheRepository.getUserCash(userId);
		return UserData.Info.of(user, userCash);
	}

	public List<UserData.UserCashLog> getUserCashLogs(Long userId) {
		return cashLogRepository.findByUserId(userId).orElseThrow(
				() -> new BaseException(USER_CASH_LOG_NOT_FOUND)
			).stream()
			.map(UserData.UserCashLog::of)
			.collect(Collectors.toList());
	}

	public List<UserData.UserItemInfo> getUserItems(Long userId) {
		return userItemRepository.findByUserId(userId).orElseThrow(
				() -> new BaseException(USER_ITEM_NOT_FOUND)
			).stream()
			.map(userItem -> UserData.UserItemInfo.of(
				userItem.getId(),
				userItem.getItem(),
				userItem.isUsed(),
				userItem.getCreatedAt().toString()))
			.collect(Collectors.toList());
	}

	@Transactional
	public void useUserItem(Long userId, Long userItemId) {

		UserItem userItem = userItemRepository.findById(userItemId)
			.filter(item -> item.getUser().getId().equals(userId))
			.orElseThrow(() -> new BaseException(USER_ITEM_NOT_FOUND));

		if (userItem.isUsed()) {
			throw new BaseException(USER_ITEM_ALREADY_USED);
		}

		userItem.useItem();

	}

	public JwtToken refresh(String refreshToken) {
		try {
			String username = jwtService.getUsername(refreshToken);

			if (authCacheRepository.existsByUsername(getSignOutKey(username))) {
				throw new BaseException(ErrorCode.EXPIRED_REFRESH_TOKEN);
			}

			return jwtService.refreshToken(refreshToken);
		} catch (Exception e) {
			throw new BaseException(ErrorCode.EXPIRED_TOKEN, e);
		}
	}

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void userPaymentEvent(UserPaymentEvent event) {

		User user = event.getUser();
		Integer cash = event.getCash();

		User findUser = userRepository.findById(user.getId())
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));
		Integer userCash = clickGameCacheRepository.getUserCash(user.getId());

		clickGameCacheRepository.updateUserCash(user.getId(), cash);
		eventPublisher.publishEvent(new CashLogEvent(user, cash, userCash + cash, "충전", CashLogType.CHARGING));

	}

	private String getSignOutKey(String username) {
		return AuthConst.SIGN_OUT_CACHE_KEY + username;
	}

	@Transactional
	public void updateUserInfo(Long userId, UserData.UpdateInfo updateInfo) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		// 닉네임 중복 체크
		String oldNickname = user.getNickname();
		String newNickname = updateInfo.getNickname();

		if (!oldNickname.equals(newNickname) && userRepository.findByNickname(newNickname).isPresent()) {
			throw new BaseException(USER_NICKNAME_DUPLICATION);
		}

		// 닉네임 업데이트
		user.updateNickname(newNickname);

		// Redis 업데이트
		updateRedisNicknameMapping(userId, oldNickname, newNickname);

		// S3 이미지 업로드 이벤트 발행
		eventPublisher.publishEvent(new S3UploadEvent(user, updateInfo.getProfileImage()));

		userRepository.save(user);

	}

	private void updateRedisNicknameMapping(Long userId, String oldNickname, String newNickname) {
		// 기존 닉네임 키 삭제
		redisTemplate.delete(NICKNAME_KEY + userId);
		redisTemplate.delete(NICKNAME_KEY + oldNickname);

		// 새로운 닉네임 키 저장
		redisTemplate.opsForValue().set(NICKNAME_KEY + userId.toString(), newNickname);
		redisTemplate.opsForValue().set(NICKNAME_KEY + newNickname, userId.toString());

		// SortedSet 내 닉네임 업데이트
		Double userClickScore = zSetOperations.score(CLICK_COUNT_KEY, oldNickname);

		if (userClickScore != null) {
			// 기존 닉네임 제거
			zSetOperations.remove(CLICK_COUNT_KEY, oldNickname);

			// 새 닉네임으로 클릭 점수 재설정
			zSetOperations.add(CLICK_COUNT_KEY, newNickname, userClickScore);
		}
	}

	@Transactional
	public void updateCash(Long userId) {

		Integer userCash = clickGameCacheRepository.getUserCash(userId);

		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		user.updateCash(userCash);

	}

	public Integer getUserCash(Long userId) {
		return clickGameCacheRepository.getUserCash(userId);
	}

	public Boolean checkNickname(Long userId, String nickname) {

		// 현재 닉네임이랑 중복되는 닉네임이 없으면 true
		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		if (userRepository.findByNickname(nickname).isEmpty()) {
			return true;
		} else {
			return user.getNickname().equals(nickname);
		}
	}

	public List<UserData.UserRewardLog> getUserRewardLogs(Long userId) {

		return clickGameRewardLogRepository.findAllByUserId(userId).orElseThrow(
				() -> new BaseException(USER_REWARD_LOG_NOT_FOUND)
			).stream()
			.map(UserData.UserRewardLog::of)
			.collect(Collectors.toList());

	}

	//    public Long save(AddUserRequest dto) {
	//        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	//
	//        return userRepository.save(User.builder()
	//                .email(dto.getEmail())
	//                .password(encoder.encode(dto.getPassword()))
	//                .build()).getId();
	//    }
}
