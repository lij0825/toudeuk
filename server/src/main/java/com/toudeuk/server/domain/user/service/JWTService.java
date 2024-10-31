package com.toudeuk.server.domain.user.service;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.properties.JwtProperties;
import com.toudeuk.server.domain.user.entity.JwtToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import static com.toudeuk.server.core.exception.ErrorCode.INVALID_ACCESS_TOKEN;

@Component
@RequiredArgsConstructor
public class JWTService {
    private final JwtProperties properties;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        this.secretKey = new SecretKeySpec(properties.getSecret().getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    /**
     * 신규 JWT 토큰(accessToken, refreshToken) 생성
     *
     * @param userId    사용자 ID
     * @param authorities 사용자 권한
     * @return {@link JwtToken} accessToken, refreshToken
     */
    public JwtToken generateToken(Long userId, Collection<? extends GrantedAuthority> authorities) {
        String authority = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = System.currentTimeMillis();

        Date accessTokenExpire = new Date(now + properties.getAccessExpire());
        Date refreshTokenExpire = new Date(now + properties.getRefreshExpire());

        String accessToken = Jwts.builder()
                .header().add("typ", "JWT").add("alg", "HS256")
                .and()
                .subject(userId.toString())
                .claim("authorities", authority)
                .issuedAt(new Date(now))
                .expiration(accessTokenExpire)
                .signWith(secretKey)
                .compact();

        String refreshToken = Jwts.builder()
                .subject(userId.toString())
                .claim("authorities", authority)
                .issuedAt(new Date(now))
                .expiration(refreshTokenExpire)
                .signWith(secretKey)
                .compact();

        return JwtToken.of(accessToken, refreshToken);
    }

    /**
     * accessToken 파싱
     *
     * @param accessToken JWT 토큰
     * @return 토큰의 클레임
     */
    public Claims parseClaims(String accessToken) {
        String message;
        Exception exception;
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(accessToken)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            message = "유효기간이 만료된 토큰입니다.";
            exception = e;
        } catch (MalformedJwtException e) {
            message = "잘못된 형식의 토큰입니다.";
            exception = e;
        } catch (IllegalArgumentException e) {
            message = "잘못된 인자입니다.";
            exception = e;
        } catch (Exception e) {
            message = "토큰 파싱 중 에러가 발생했습니다.";
            exception = e;
        }
        throw new BaseException(INVALID_ACCESS_TOKEN, message, exception);
    }

    public String getUsername(String accessToken) throws Exception {
        Claims claims = parseClaims(accessToken);
        return claims.getSubject();
    }

    public JwtToken refreshToken(String refreshToken) {
        Claims claims = parseClaims(refreshToken);

        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("authorities").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .toList();

        return generateToken(Long.parseLong(claims.getSubject()), authorities);
    }

    public Authentication parseAuthentication(String accessToken) throws Exception {
        Claims claims = parseClaims(accessToken);

        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("authorities").toString().split(","))
                        .map((authority) -> new SimpleGrantedAuthority("ROLE_" + authority))
                        .toList();

        UserDetails principal = new org.springframework.security.core.userdetails.User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }
}