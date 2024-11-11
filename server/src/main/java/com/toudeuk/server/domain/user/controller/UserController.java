package com.toudeuk.server.domain.user.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.core.constants.AuthConst;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.properties.JwtProperties;
import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.core.util.CookieUtils;
import com.toudeuk.server.domain.item.service.ItemService;
import com.toudeuk.server.domain.user.dto.UserData;
import com.toudeuk.server.domain.user.dto.UserItemData;
import com.toudeuk.server.domain.user.entity.JwtToken;
import com.toudeuk.server.domain.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
	private final ItemService itemService;

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
	 * 유저 닉네임 중복 확인
	 *
	 * @param nickname
	 * @return {@link SuccessResponse<Boolean>}
	 */
	@GetMapping(value = "/nickname/check")
	@Operation(summary = "유저 닉네임 중복 확인", description = "유저 닉네임 중복을 확인합니다.")
	public SuccessResponse<Boolean> checkNickname(@CurrentUser Long userId, @RequestParam String nickname) {
		return SuccessResponse.of(userService.checkNickname(userId, nickname));
	}

	/**
	 * 유저 정보 수정
	 *
	 * @param updateInfo
	 * @return {@link SuccessResponse<Void>}
	 */
	@PatchMapping(value = "", consumes = {"multipart/form-data"})
	@Operation(summary = "유저 정보 수정", description = "유저 정보를 수정합니다.")
	public SuccessResponse<Void> updateUserInfo(@CurrentUser Long userId,
		@ModelAttribute UserData.UpdateInfo updateInfo) {
		userService.updateUserInfo(userId, updateInfo);
		return SuccessResponse.empty();
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
	@Operation(summary = "토큰 재발급", description = "토큰을 재발급합니다.")
	@ResponseStatus(value = HttpStatus.CREATED)
	public SuccessResponse<JwtToken> refresh(HttpServletRequest request, HttpServletResponse response) {
		Cookie cookie = CookieUtils.getCookie(request, AuthConst.REFRESH_TOKEN).orElseThrow(
			() -> new BaseException(ErrorCode.UNAUTHORIZED)
		);

		JwtToken refreshedToken = userService.refresh(cookie.getValue());

		CookieUtils.removeCookie(response, AuthConst.REFRESH_TOKEN);
		CookieUtils.addCookie(response, AuthConst.REFRESH_TOKEN, refreshedToken.getRefreshToken(),
			properties.getRefreshExpire(), true);
		return SuccessResponse.of(refreshedToken);
	}

	//	/**
	//	 * 나의 아이템 목록 조회
	//	 *
	//	 * @param userId
	//	 * @return {@link SuccessResponse<List<UserItemData.UserItemInfo>>}
	//	 */
	//	@GetMapping(value = "/item")
	//	@Operation(summary = "나의 아이템 목록 조회", description = "나의 아이템 목록을 조회합니다.")
	//	public SuccessResponse<List<UserItemData.UserItemInfo>> getMyItemList(@CurrentUser Long userId) {
	//		return SuccessResponse.of(itemService.getUserItemList(userId));
	//	}

	/**
	 * 나의 아이템 상세 조회
	 *
	 * @param userId, userItemId
	 * @return {@link SuccessResponse<UserItemData.UserItemDetail>}
	 */
	@GetMapping(value = "/item/detail")
	@Operation(summary = "나의 아이템 상세 조회", description = "나의 아이템 상세 정보를 조회합니다.")
	public SuccessResponse<UserItemData.UserItemDetail> getMyItemDetail(@CurrentUser Long userId,
		@RequestParam Long userItemId) {
		return SuccessResponse.of(itemService.getUserItemDetail(userId, userItemId));
	}

	/**
	 * 아이템 사용
	 *
	 * @param userId, userItemId
	 * @return {@link SuccessResponse<Void>}
	 */
	@PostMapping(value = "/item/use")
	@Operation(summary = "아이템 사용", description = "아이템을 사용합니다.")
	public SuccessResponse<Void> useItem(@CurrentUser Long userId, @RequestBody UserItemData.Use use) {
		itemService.useItem(userId, use.getUserItemId());
		return SuccessResponse.empty();
	}

	/**
	 * 유저 캐쉬 업데이트, redis -> db
	 *
	 * @param userId
	 * @return {@link SuccessResponse<Void>}
	 */
	@PostMapping(value = "/cash/update")
	@Operation(summary = "유저 캐쉬 업데이트", description = "유저 캐쉬를 업데이트합니다. redis -> db")
	public SuccessResponse<Void> updateCash(@CurrentUser Long userId) {
		userService.updateCash(userId);
		return SuccessResponse.empty();
	}

	/**
	 * 내가 받은 모든 보상 내역
	 *
	 * @param userId
	 * @return {@link SuccessResponse<List<UserData.UserRewardLog>>}
	 */
	@GetMapping(value = "/reward-logs")
	@Operation(summary = "내가 받은 모든 보상 내역", description = "내가 받은 모든 보상 내역을 조회합니다.")
	public SuccessResponse<List<UserData.UserRewardLog>> getUserRewardLogs(@CurrentUser Long userId) {
		return SuccessResponse.of(userService.getUserRewardLogs(userId));
	}
}
