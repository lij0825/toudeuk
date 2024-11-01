package com.toudeuk.server.domain.user.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.toudeuk.server.core.constants.AuthConst;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private final JWTService jwtService;
	private final AuthCacheRepository authCacheRepository;
	private final UserRepository userRepository;
	private final UserItemRepository userItemRepository;
	private final CashLogRepository cashLogRepository;
	private final ApplicationEventPublisher eventPublisher;

	public List<User> findAll() {
		return userRepository.findAll();
	}

	public UserData.Info getUserInfo(Long userId) {
		return UserData.Info.of(userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND)));
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

		findUser.updateCash(findUser.getCash() + cash);
		eventPublisher.publishEvent(new CashLogEvent(user, cash, findUser.getCash(), "충전", CashLogType.CHARGING));
		userRepository.save(findUser);
	}

	private String getSignOutKey(String username) {
		return AuthConst.SIGN_OUT_CACHE_KEY + username;
	}

	@Transactional
	public void updateUserInfo(Long userId, UserData.UpdateInfo updateInfo) {

		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		user.updateNickname(updateInfo.getNickname());

		eventPublisher.publishEvent(new S3UploadEvent(user, updateInfo.getProfileImage()));

		userRepository.save(user);
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
