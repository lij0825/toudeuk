package com.toudeuk.server.domain.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.user.dto.UserData;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/v1/user")
@RequiredArgsConstructor
@Tag(name = "유저", description = "유저 관련 API")
public class UserController {

	private final UserService userService;

	/**
	 * 유저 정보 조회
	 *
	 * @param user
	 * @return {@link SuccessResponse<UserData.Info>}
	 */
	@GetMapping(value = "/info")
	@Operation(summary = "유저 정보 조회", description = "유저 정보를 조회합니다.")
	public SuccessResponse<UserData.Info> getUserInfo(@CurrentUser User user) {
		return SuccessResponse.of(userService.getUserInfo(user.getId()));
	}

	/**
	 * 유저 캐쉬 로그 조회
	 *
	 * @param user
	 * @return {@link SuccessResponse<List<UserData.UserCashLog>>}
	 */
	@GetMapping(value = "/cash-logs")
	@Operation(summary = "유저 캐쉬 로그 조회", description = "유저 캐쉬 로그를 조회합니다.")
	public SuccessResponse<List<UserData.UserCashLog>> getUserCashLogs(@CurrentUser User user) {
		return SuccessResponse.of(userService.getUserCashLogs(user.getId()));
	}

	/**
	 * 유저 아이템 조회
	 *
	 * @param user
	 * @return {@link SuccessResponse<List<UserData.UserItemInfo>}
	 */
	@GetMapping(value = "/items")
	@Operation(summary = "유저 아이템 조회", description = "유저 아이템을 조회합니다.")
	public SuccessResponse<List<UserData.UserItemInfo>> getUserItems(@CurrentUser User user) {
		return SuccessResponse.of(userService.getUserItems(user.getId()));
	}

	/**
	 * 유저 아이템 사용 처리
	 *
	 * @param  user, userItemId
	 * @return {@link SuccessResponse<Void>}
	 */
	@PostMapping(value = "/items/use")
	@Operation(summary = "유저 아이템 사용 처리", description = "유저 아이템을 사용 처리합니다.")
	public SuccessResponse<Void> useUserItem(@CurrentUser User user, @RequestBody UserData.UserItemUse use) {
		userService.useUserItem(user.getId(), use.getUserItemId());
		return SuccessResponse.empty();
	}
}
