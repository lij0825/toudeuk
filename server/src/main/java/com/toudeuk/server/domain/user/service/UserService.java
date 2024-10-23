package com.toudeuk.server.domain.user.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.user.dto.UserData;
import com.toudeuk.server.domain.user.entity.UserItem;
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

	private final UserRepository userRepository;
	private final UserItemRepository userItemRepository;
	private final CashLogRepository cashLogRepository;

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
}
