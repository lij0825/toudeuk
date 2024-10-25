package com.toudeuk.server.domain.user.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.jwt.TokenProvider;
import com.toudeuk.server.domain.user.dto.UserData;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.entity.UserItem;
import com.toudeuk.server.domain.user.repository.CashLogRepository;
import com.toudeuk.server.domain.user.repository.UserItemRepository;
import com.toudeuk.server.domain.user.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private final UserRepository userRepository;
	private final UserItemRepository userItemRepository;
	private final CashLogRepository cashLogRepository;
	private final TokenProvider tokenProvider;

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

	//    public Long save(AddUserRequest dto) {
	//        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	//
	//        return userRepository.save(User.builder()
	//                .email(dto.getEmail())
	//                .password(encoder.encode(dto.getPassword()))
	//                .build()).getId();
	//    }

	public User findByEmail(String email) {

		log.info("find by email: {}", email);

		return userRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("Unexpected user"));
	}

	public boolean findByNickname(String nickName) {
		log.info("find by nickname: {}", nickName);

		Optional<User> findUser = userRepository.findByNickname(nickName);

		return findUser.isEmpty();
	}

	// find user list by name field
	public List<User> findByNameContaining(String name) {

		List<User> findUserList = userRepository.findByNameContaining(name);

		if (findUserList.isEmpty())
			throw new EntityNotFoundException(ErrorCode.USER_NOT_EXISTS.getMessage());

		return findUserList;
	}

	public Long findUserIdByToken(String token) {

		Long userId = tokenProvider.getUserId(token);

		return userId;
	}
}
