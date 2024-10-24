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

    USER_NOT_EXISTS(1002, HttpStatus.NOT_FOUND, "해당 회원은 존재하지 않습니다."),

    INVALID_TOKEN(2002, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),

    NOT_VALID_BEARER_GRANT_TYPE(401, HttpStatus.UNAUTHORIZED, "인증 타입이 Bearer 타입이 아닙니다."),
    NOT_EXISTS_AUTHORIZATION(401, HttpStatus.UNAUTHORIZED, "Authorization Header가 빈값입니다."),
    NOT_ACCESS_TOKEN_TYPE(1003, HttpStatus.UNAUTHORIZED, "해당 토큰은 access token이 아닙니다."),
    FORBIDDEN_ADMIN(404, HttpStatus.FORBIDDEN, "관리자 Role이 아닙니다.");

    private final int code;
    private final HttpStatus status;
    private final String message;
}
