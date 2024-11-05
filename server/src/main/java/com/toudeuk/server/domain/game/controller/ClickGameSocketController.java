package com.toudeuk.server.domain.game.controller;

import com.toudeuk.server.domain.game.dto.GameData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.domain.game.service.ClickGameService;
import com.toudeuk.server.domain.user.service.JWTService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ClickGameSocketController {

	private final ClickGameService clickGameService;
	private final JWTService jwtService;
    private final SimpMessagingTemplate messagingTemplate;

    @SendTo("")
    public void sendStart(){
    }

    @MessageMapping("/game")
    public void sendPublish(@Header("Authorization") String bearerToken) throws Exception {
        Long userId = resolveToken(bearerToken);

        log.info("-==================================================");
        log.info("-==================================================");

        clickGameService.click(userId);

    }


    @MessageMapping("/topic/connect")
    public void ping(@Header("Authorization") String bearerToken) throws Exception {
        Long userId = resolveToken(bearerToken);

        System.out.println(userId);


        clickGameService.checkGame(userId);
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
