package com.toudeuk.server.core.interceptor;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.jwt.TokenProvider;
import com.toudeuk.server.core.jwt.constant.TokenType;
import com.toudeuk.server.core.util.AuthorizationUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthenticationInterceptor implements HandlerInterceptor {

    private final TokenProvider tokenProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        if (request.getMethod().equals("OPTIONS"))
            return true;

        String authorization = request.getHeader("Authorization");
        AuthorizationUtils.validateAuthorization(authorization);

        String accessToken = authorization.split(" ")[1];
        tokenProvider.validToken(accessToken);

        Claims claims = tokenProvider.getClaims(accessToken);
        String tokenType = claims.getSubject();

        if (!TokenType.isAccessToken(tokenType))
            throw new BaseException(ErrorCode.NOT_ACCESS_TOKEN_TYPE);

        return true;
    }
}
