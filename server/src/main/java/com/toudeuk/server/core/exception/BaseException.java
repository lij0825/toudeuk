package com.toudeuk.server.core.exception;

import org.springframework.validation.Errors;

import lombok.Getter;

@Getter
public class BaseException extends RuntimeException {

    public static final BaseException SERVER_ERROR = new BaseException(ErrorCode.SERVER_ERROR);
    public static final BaseException INVALID_INPUT_VALUE = new BaseException(ErrorCode.INVALID_INPUT_VALUE);
    public static final BaseException ACCESS_DENIED = new BaseException(ErrorCode.ACCESS_DENIED);

    public static final BaseException USER_NOT_FOUND = new BaseException(ErrorCode.USER_NOT_FOUND);
    public static final BaseException USER_CASH_LOG_NOT_FOUND = new BaseException(ErrorCode.USER_CASH_LOG_NOT_FOUND);
    public static final BaseException INVALID_TOKEN = new BaseException(ErrorCode.INVALID_TOKEN);
    public static final BaseException UNAUTHORIZED = new BaseException(ErrorCode.UNAUTHORIZED);
    public static final BaseException NOT_ENOUGH_CASH = new BaseException(ErrorCode.NOT_ENOUGH_CASH);

    public static final BaseException EXPIRED_TOKEN = new BaseException(ErrorCode.EXPIRED_TOKEN);
    public static final BaseException EXPIRED_REFRESH_TOKEN = new BaseException(ErrorCode.EXPIRED_REFRESH_TOKEN);
    public static final BaseException INVALID_ACCESS_TOKEN = new BaseException(ErrorCode.INVALID_ACCESS_TOKEN);

    public static final BaseException USER_NICKNAME_DUPLICATION = new BaseException(ErrorCode.USER_NICKNAME_DUPLICATION);
    public static final BaseException USER_REWARD_LOG_NOT_FOUND = new BaseException(ErrorCode.USER_REWARD_LOG_NOT_FOUND);

    public static final BaseException ITEM_NOT_FOUND = new BaseException(ErrorCode.ITEM_NOT_FOUND);
    public static final BaseException USER_ITEM_NOT_FOUND = new BaseException(ErrorCode.USER_ITEM_NOT_FOUND);
    public static final BaseException USER_ITEM_ALREADY_USED = new BaseException(ErrorCode.USER_ITEM_ALREADY_USED);

    public static final BaseException GAME_ERROR = new BaseException(ErrorCode.GAME_ERROR);
    public static final BaseException GAME_NOT_FOUND = new BaseException(ErrorCode.GAME_NOT_FOUND);
    public static final BaseException REWARD_USER_NOT_FOUND = new BaseException(ErrorCode.REWARD_USER_NOT_FOUND);
    public static final BaseException COOL_TIME = new BaseException(ErrorCode.COOL_TIME);
    public static final BaseException GAME_LOG_NOT_FOUND = new BaseException(ErrorCode.GAME_LOG_NOT_FOUND);
    public static final BaseException GAME_ALREADY_EXIST = new BaseException(ErrorCode.GAME_ALREADY_EXIST);
    public static final BaseException SAVING_GAME_ERROR = new BaseException(ErrorCode.SAVING_GAME_ERROR);

    public static final BaseException KAKAO_PAY_API_ERROR = new BaseException(ErrorCode.KAKAO_PAY_API_ERROR);

    public static final BaseException NOT_SUPPORTED_EXTENTION = new BaseException(ErrorCode.NOT_SUPPORTED_EXTENTION);
    public static final BaseException FAIL_TO_CREATE_FILE = new BaseException(ErrorCode.FAIL_TO_CREATE_FILE);
    public static final BaseException EMPTY_FILE = new BaseException(ErrorCode.EMPTY_FILE);
    public static final BaseException FAIL_TO_DELETE_FILE = new BaseException(ErrorCode.FAIL_TO_DELETE_FILE);

    public static final BaseException USER_NOT_EXISTS = new BaseException(ErrorCode.USER_NOT_EXISTS);

    public static final BaseException NOT_VALID_BEARER_GRANT_TYPE = new BaseException(ErrorCode.NOT_VALID_BEARER_GRANT_TYPE);
    public static final BaseException NOT_EXISTS_AUTHORIZATION = new BaseException(ErrorCode.NOT_EXISTS_AUTHORIZATION);
    public static final BaseException NOT_ACCESS_TOKEN_TYPE = new BaseException(ErrorCode.NOT_ACCESS_TOKEN_TYPE);
    public static final BaseException FORBIDDEN_ADMIN = new BaseException(ErrorCode.FORBIDDEN_ADMIN);

    public static final BaseException KAFKA_PRODUCER_ERROR = new BaseException(ErrorCode.KAFKA_PRODUCER_ERROR);
    public static final BaseException KAFKA_CONSUMER_ERROR = new BaseException(ErrorCode.KAFKA_CONSUMER_ERROR);



    private final ErrorCode errorCode;
    private final String message;
    private Errors errors;

    private BaseException(Throwable cause) {
        super(cause);
        this.errorCode = ErrorCode.SERVER_ERROR;
        this.message = cause.getMessage();
    }

    private BaseException(ErrorCode errorCode, Throwable cause) {
        super(cause);
        this.errorCode = errorCode;
        this.message = errorCode.getMessage();
    }

    private BaseException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.message = errorCode.getMessage();
    }

    private BaseException(ErrorCode errorCode, Errors errors) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.message = errorCode.getMessage();
        this.errors = errors;
    }

    private BaseException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
    }

    public BaseException(ErrorCode errorCode, String message, Throwable cause) {
        super(cause);
        this.errorCode = errorCode;
        this.message = message;
    }

    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}
