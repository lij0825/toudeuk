package com.toudeuk.server.domain.user.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.user.dto.UserData;
import com.toudeuk.server.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private final UserRepository userRepository;

	public UserData.Info getUserInfo(Long userId) {
		return UserData.Info.of(userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND)));
	}

}
