package com.toudeuk.server.core.response;



import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.Gson;
import com.toudeuk.server.core.exception.ErrorCode;
import lombok.Getter;

public class ErrorResponse extends BaseResponse<Void> {
    private final static ErrorResponse EMPTY = new ErrorResponse();

    @JsonIgnore
    private Void data;

    @Getter
    private Object extras;

    private ErrorResponse() {
        this.success = false;
        this.status = ErrorCode.SERVER_ERROR.getCode();
        this.message = ErrorCode.SERVER_ERROR.getMessage();
    }

    private ErrorResponse(ErrorCode errorCode) {
        this.success = false;
        this.status = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    private ErrorResponse(ErrorCode errorCode, String message) {
        this.success = false;
        this.status = errorCode.getCode();
        this.message = message;
    }

    private ErrorResponse(ErrorCode errorCode, Object errors) {
        this.success = false;
        this.status = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.errors = errors;
    }

    private ErrorResponse(ErrorCode errorCode, String message, Object extras) {
        this.success = false;
        this.status = errorCode.getCode();
        this.message = message;
        this.extras = extras;
    }

    public static ErrorResponse empty() {
        return EMPTY;
    }

    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(errorCode);
    }

    public static ErrorResponse of(ErrorCode errorCode, String message) {
        return new ErrorResponse(errorCode, message);
    }

    public static ErrorResponse of(ErrorCode errorCode, String message, Object extras) {
        return new ErrorResponse(errorCode, message, extras);
    }

    public String toJson() {
        return new Gson().toJson(this);
    }

}