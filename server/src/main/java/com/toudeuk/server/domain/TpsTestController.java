package com.toudeuk.server.domain;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.response.SuccessResponse;

@RestController
public class TpsTestController {
	@GetMapping("/test")
	public SuccessResponse<String> test() {
		return SuccessResponse.of("test");
	}
}
