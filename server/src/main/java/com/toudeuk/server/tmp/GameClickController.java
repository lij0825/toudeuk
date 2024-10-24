package com.toudeuk.server.tmp;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameClickController {

	private static Integer cnt = 0;

	@MessageMapping("/game")
	@SendTo("/topic/game")
	public Integer greeting() {
		return ++cnt;
	}
}