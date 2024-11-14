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
	ACCESS_DENIED(1002, HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),

	// User
	USER_NOT_FOUND(2000, HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
	USER_CASH_LOG_NOT_FOUND(2001, HttpStatus.NOT_FOUND, "사용자의 캐시 로그를 찾을 수 없습니다."),
	INVALID_TOKEN(2002, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
	UNAUTHORIZED(2003, HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
	NOT_ENOUGH_CASH(2004, HttpStatus.BAD_REQUEST, "캐시가 부족합니다."),

	EXPIRED_TOKEN(2005, HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
	EXPIRED_REFRESH_TOKEN(2006, HttpStatus.UNAUTHORIZED, "만료된 리프레시 토큰입니다."),
	INVALID_ACCESS_TOKEN(2008, HttpStatus.UNAUTHORIZED, "유효하지 않은 액세스 토큰입니다."),

	USER_NICKNAME_DUPLICATION(2009, HttpStatus.BAD_REQUEST, "닉네임이 중복되었습니다."),
	USER_REWARD_LOG_NOT_FOUND(2010, HttpStatus.NOT_FOUND, "사용자의 보상 로그를 찾을 수 없습니다."),

	// Item
	ITEM_NOT_FOUND(3000, HttpStatus.NOT_FOUND, "아이템을 찾을 수 없습니다."),
	USER_ITEM_NOT_FOUND(3001, HttpStatus.NOT_FOUND, "사용자의 아이템을 찾을 수 없습니다."),
	USER_ITEM_ALREADY_USED(3002, HttpStatus.BAD_REQUEST, "이미 사용한 아이템입니다."),

	// Game
	GAME_ERROR(4000, HttpStatus.BAD_REQUEST, "게임에 에러가 발생하였습니다."),
	GAME_NOT_FOUND(4001, HttpStatus.NOT_FOUND, "게임을 찾을 수 없습니다."),
	REWARD_USER_NOT_FOUND(4002, HttpStatus.NOT_FOUND, "보상 받을 유저를 찾을 수 없습니다."),
	COOL_TIME(4003, HttpStatus.BAD_REQUEST, "쿨타임입니다."),
	GAME_LOG_NOT_FOUND(4004, HttpStatus.NOT_FOUND, "게임 로그를 찾을 수 없습니다."),
	GAME_ALREADY_EXIST(4005, HttpStatus.BAD_REQUEST, "이미 게임이 존재합니다."),
	SAVING_GAME_ERROR(4006, HttpStatus.BAD_REQUEST, "게임 저장 중 에러가 발생하였습니다."),
	GAME_END(4007, HttpStatus.BAD_REQUEST, "이미 종료된 게임입니다."),

	// KakaoPay
	KAKAO_PAY_API_ERROR(5000, HttpStatus.BAD_REQUEST, "카카오페이 API 에러가 발생하였습니다."),

	// Image
	NOT_SUPPORTED_EXTENTION(6000, HttpStatus.BAD_REQUEST, "지원하지 않는 확장자입니다."),
	FAIL_TO_CREATE_FILE(6001, HttpStatus.INTERNAL_SERVER_ERROR, "파일 생성에 실패하였습니다."),
	EMPTY_FILE(6002, HttpStatus.BAD_REQUEST, "빈 파일입니다."),
	FAIL_TO_DELETE_FILE(6003, HttpStatus.INTERNAL_SERVER_ERROR, "파일 삭제에 실패하였습니다."),
	// ---
	USER_NOT_EXISTS(1002, HttpStatus.NOT_FOUND, "해당 회원은 존재하지 않습니다."),

	NOT_VALID_BEARER_GRANT_TYPE(401, HttpStatus.UNAUTHORIZED, "인증 타입이 Bearer 타입이 아닙니다."),
	NOT_EXISTS_AUTHORIZATION(401, HttpStatus.UNAUTHORIZED, "Authorization Header가 빈값입니다."),
	NOT_ACCESS_TOKEN_TYPE(1003, HttpStatus.UNAUTHORIZED, "해당 토큰은 access token이 아닙니다."),
	FORBIDDEN_ADMIN(404, HttpStatus.FORBIDDEN, "관리자 Role이 아닙니다."),

	// KAFKA
	KAFKA_PRODUCER_ERROR(5000, HttpStatus.SERVICE_UNAVAILABLE, "카프카 메시지 발행 도중 오류가 발생했습니다."),
	KAFKA_CONSUMER_ERROR(5001, HttpStatus.SERVICE_UNAVAILABLE, "카프카 메시지 소비 도중 오류가 발생했습니다.");

	private final int code;
	private final HttpStatus status;
	private final String message;
}
