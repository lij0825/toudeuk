package com.toudeuk.server.core.util;

import com.toudeuk.server.core.exception.AuthenticationException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.jwt.constant.GrantType;
import org.springframework.util.StringUtils;

public class AuthorizationUtils {

    public static void validateAuthorization(String header) {

        if (!StringUtils.hasText(header))
            throw new AuthenticationException(ErrorCode.NOT_EXISTS_AUTHORIZATION);

        String[] authHeader = header.split(" ");

        if (authHeader.length < 2 || (!GrantType.BEARER.getType().equals(authHeader[0])))
            throw new AuthenticationException(ErrorCode.NOT_VALID_BEARER_GRANT_TYPE);
    }
}
