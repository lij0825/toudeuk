package com.toudeuk.server.tmp;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;

import com.toudeuk.server.domain.user.service.JWTService;

import io.jsonwebtoken.Claims;
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
		Long userId = resolveToken(bearerToken);

		System.out.println(userId + " 유저 아이디 ");

		return ++cnt;
	}

	private Long resolveToken(String bearerToken) {
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			String token = bearerToken.substring(7);

			Claims claims = jwtService.parseClaims(token);
			return Long.parseLong(claims.getSubject());
		}
		return null;
	}
}