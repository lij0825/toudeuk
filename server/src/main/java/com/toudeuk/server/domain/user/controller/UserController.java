package com.toudeuk.server.domain.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.user.dto.UserData;
import com.toudeuk.server.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/v1/user")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	/**
	 * 유저 정보 조회
	 *
	 * @param userId
	 * @return {@link SuccessResponse<UserData.Info>}
	 */
	@GetMapping(value = "/info")
	public SuccessResponse<UserData.Info> getUserInfo(@RequestParam Long userId) {
		// FIXME : CurrentUser 나오면 수정
		return SuccessResponse.of(userService.getUserInfo(userId));
	}

	/**
	 * 유저 캐쉬 로그 조회
	 *
	 * @param userId
	 * @return {@link SuccessResponse<List<UserData.UserCashLog>>}
	 */
	@GetMapping(value = "/cash-logs")
	public SuccessResponse<List<UserData.UserCashLog>> getUserCashLogs(@RequestParam Long userId) {
		// FIXME : CurrentUser 나오면 수정
		return SuccessResponse.of(userService.getUserCashLogs(userId));
	}

	/**
	 * 유저 아이템 조회
	 *
	 * @param userId
	 * @return {@link SuccessResponse<List<UserData.UserItemInfo>}
	 */
	@GetMapping(value = "/items")
	public SuccessResponse<List<UserData.UserItemInfo>> getUserItems(@RequestParam Long userId) {
		// FIXME : CurrentUser 나오면 수정
		return SuccessResponse.of(userService.getUserItems(userId));
	}

	/**
	 * 유저 아이템 사용 처리
	 *
	 * @param userId, userItemId
	 * @return {@link SuccessResponse<Void>}
	 */
	@PostMapping(value = "/items/use")
	public SuccessResponse<Void> useUserItem(@RequestParam Long userId, @RequestParam Long userItemId) {
		// FIXME : CurrentUser 나오면 수정
		userService.useUserItem(userId, userItemId);
		return SuccessResponse.empty();
	}
}
