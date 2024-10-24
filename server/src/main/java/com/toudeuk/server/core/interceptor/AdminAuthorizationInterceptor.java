package com.toudeuk.server.core.interceptor;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.jwt.TokenProvider;
import com.toudeuk.server.domain.user.entity.RoleType;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AdminAuthorizationInterceptor implements HandlerInterceptor {

    private final TokenProvider tokenProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        if (request.getMethod().equals("OPTIONS"))
            return true;

        String authorization = request.getHeader("Authorization");
        String accessToken = authorization.split(" ")[1];

        Claims claims = tokenProvider.getClaims(accessToken);
        String role = (String) claims.get("role");

        if (!RoleType.isRoleType(role))
            throw new BaseException(ErrorCode.FORBIDDEN_ADMIN);

        return true;
    }
}
