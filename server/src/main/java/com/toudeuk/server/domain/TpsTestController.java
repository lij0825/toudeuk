package com.toudeuk.server.domain;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
public class TpsTestController {
	private final UserService userService;

	public TpsTestController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/test")
	public SuccessResponse<String> test() {
		return SuccessResponse.of("test");
	}

	@GetMapping("/{userId}")
	@Operation(summary = "유저 캐쉬 조회", description = "유저 캐쉬를 조회합니다.")
	public SuccessResponse<Integer> getUserCash(@PathVariable Long userId) {
		return SuccessResponse.of(userService.getUserCash(userId));
	}
}
