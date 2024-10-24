package com.toudeuk.server.domain.game.service;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OptimistickLockGameFacade {
	private final GameService gameService;


	public void click(Long userId, Long gameId) throws InterruptedException {
		while (true){
			try {
				gameService.optimisticClick(userId, gameId);
				break;
			} catch (IllegalArgumentException e) {
				break;
			}
			catch (Exception e) {
				Thread.sleep(50);
			}
		}
	}
}
