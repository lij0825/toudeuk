package com.toudeuk.server.tmp;


import java.nio.charset.StandardCharsets;
import java.util.function.Function;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;

import com.toudeuk.server.domain.user.service.JWTService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class GameClickController {
	private static Integer cnt = 0;

	private final JWTService jwtService;


	@MessageMapping("/game")
	@SendTo("/topic/game")
	public Integer greeting(@Header("Authorization") String bearerToken) throws Exception {
		;
		String token = resolveToken(bearerToken);

		Claims claims = jwtService.parseClaims(token);

		System.out.println(claims.getSubject() + " 유저 아이디 ");

		return ++cnt;
	}

	private String resolveToken(String bearerToken) {
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}
}