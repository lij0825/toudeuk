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
	USER_NOT_FOUND(2000, HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
	USER_CASH_LOG_NOT_FOUND(2001, HttpStatus.NOT_FOUND, "사용자의 캐시 로그를 찾을 수 없습니다."),
	// Item
	ITEM_NOT_FOUND(3000, HttpStatus.NOT_FOUND, "아이템을 찾을 수 없습니다."),
	USER_ITEM_NOT_FOUND(3001, HttpStatus.NOT_FOUND, "사용자의 아이템을 찾을 수 없습니다."),
	USER_ITEM_ALREADY_USED(3002, HttpStatus.BAD_REQUEST, "이미 사용한 아이템입니다.");

	private final int code;
	private final HttpStatus status;
	private final String message;
}
