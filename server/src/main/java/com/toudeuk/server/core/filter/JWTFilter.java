package com.toudeuk.server.core.filter;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.domain.user.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {
    public final String AUTHORIZATION_HEADER = "Authorization";
    private final JWTService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        if (!requestURI.startsWith("/api/v1")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = resolveToken(request);
        try {
            if (accessToken != null) {
                Authentication authentication = jwtService.parseAuthentication(accessToken);
                validateToken(request, authentication.getName());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                throw new BaseException(ErrorCode.INVALID_ACCESS_TOKEN);
            }
        } catch (Exception e) {
            log.error("errors: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            request.setAttribute("error-message", e.getMessage());
        }
        doFilter(request, response, filterChain);
    }

    private void validateToken(HttpServletRequest request, String username) {
//        Cookie cookie = CookieUtils.getCookie(request, AuthConst.REFRESH_TOKEN).orElseThrow(
//                () -> new IllegalArgumentException("로그인 되어있지 않습니다.")
//        );
//
//        String refreshToken = authCacheRepository.findByUsername(username);
//
//        if (refreshToken != null && refreshToken.equals(cookie.getValue())) {
//            throw new IllegalArgumentException("로그아웃된 사용자입니다.");
//        }
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
