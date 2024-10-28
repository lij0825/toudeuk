package com.toudeuk.server.domain.user.handler;

import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        ErrorResponse errorResponse = ErrorResponse.of(ErrorCode.ACCESS_DENIED, request.getAttribute("error-message").toString());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(errorResponse.toJson());
    }
}
