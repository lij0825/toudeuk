package com.toudeuk.server.core.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
	// Common
	SERVER_ERROR(1000, HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러가 발생하였습니다."),
	INVALID_INPUT_VALUE(1001, HttpStatus.BAD_REQUEST, "유효하지 않은 입력 값입니다."),

	// User
	USER_NOT_FOUND(2000, HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
	// Item

	private final int code;
	private final HttpStatus status;
	private final String message;
}
