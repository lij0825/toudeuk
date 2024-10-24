package com.toudeuk.server.tmp;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.jwt.TokenProvider;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class GameClickController {

	private static Integer cnt = 0;
	private final TokenProvider tokenProvider;

	@MessageMapping("/game")
	@SendTo("/topic/game")
	public String greeting(StompHeaderAccessor headerAccessor) {
		String token = headerAccessor.getSessionId();

		// if(!tokenProvider.validToken(token)) {
		// 	throw new BaseException(ErrorCode.INVALID_TOKEN);
		// }
		// Long userId = tokenProvider.getUserId(token);

		return ++cnt + " " + token ;
	}
}