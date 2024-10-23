package com.toudeuk.server.core.exception;

import lombok.Getter;

@Getter
public class AuthenticationException extends BaseException{

    public AuthenticationException(ErrorCode errorCode) {
        super(errorCode);
    }
}
