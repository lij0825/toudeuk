package com.toudeuk.server.domain.user.controller;

import java.util.List;

import com.toudeuk.server.core.constants.AuthConst;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.properties.JwtProperties;
import com.toudeuk.server.core.util.CookieUtils;
import com.toudeuk.server.domain.user.entity.JwtToken;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

	private final JwtProperties properties;
	private final UserService userService;

	/**
	 * 유저 정보 조회
	 *
	 * @param userId
	 * @return {@link SuccessResponse<UserData.Info>}
	 */
	@GetMapping(value = "/info")
	@Operation(summary = "유저 정보 조회", description = "유저 정보를 조회합니다.")
	public SuccessResponse<UserData.Info> getUserInfo(@CurrentUser Long userId) {
		return SuccessResponse.of(userService.getUserInfo(userId));
	}

	/**
	 * 유저 캐쉬 로그 조회
	 *
	 * @param userId
	 * @return {@link SuccessResponse<List<UserData.UserCashLog>>}
	 */
	@GetMapping(value = "/cash-logs")
	@Operation(summary = "유저 캐쉬 로그 조회", description = "유저 캐쉬 로그를 조회합니다.")
	public SuccessResponse<List<UserData.UserCashLog>> getUserCashLogs(@CurrentUser Long userId) {
		return SuccessResponse.of(userService.getUserCashLogs(userId));
	}

	/**
	 * 유저 아이템 조회
	 *
	 * @param userId
	 * @return {@link SuccessResponse<List<UserData.UserItemInfo>}
	 */
	@GetMapping(value = "/items")
	@Operation(summary = "유저 아이템 조회", description = "유저 아이템을 조회합니다.")
	public SuccessResponse<List<UserData.UserItemInfo>> getUserItems(@CurrentUser Long userId) {
		return SuccessResponse.of(userService.getUserItems(userId));
	}

	/**
	 * 유저 아이템 사용 처리
	 *
	 * @param  userId, userItemId
	 * @return {@link SuccessResponse<Void>}
	 */
	@PostMapping(value = "/items/use")
	@Operation(summary = "유저 아이템 사용 처리", description = "유저 아이템을 사용 처리합니다.")
	public SuccessResponse<Void> useUserItem(@CurrentUser Long userId, @RequestBody UserData.UserItemUse use) {
		userService.useUserItem(userId, use.getUserItemId());
		return SuccessResponse.empty();
	}


	@PostMapping(value = "/refresh")
	@ResponseStatus(value = HttpStatus.CREATED)
	public SuccessResponse<JwtToken> refresh(HttpServletRequest request, HttpServletResponse response) {
		Cookie cookie = CookieUtils.getCookie(request, AuthConst.REFRESH_TOKEN).orElseThrow(
				() -> new BaseException(ErrorCode.UNAUTHORIZED)
		);

		JwtToken refreshedToken = userService.refresh(cookie.getValue());

		CookieUtils.removeCookie(response, AuthConst.REFRESH_TOKEN);
		CookieUtils.addCookie(response, AuthConst.REFRESH_TOKEN, refreshedToken.getRefreshToken(), properties.getRefreshExpire(), true);
		return SuccessResponse.of(refreshedToken);
	}
}
