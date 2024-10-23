package com.toudeuk.server.domain.game.controller.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {

	private final ClickGameRepository clickGameRepository;

	private final ClickGameLogRepository clickGameLogRepository;
	private final UserRepository userRepository;

	@Transactional
	public void click(Long userId, Long gameId) {

		ClickGame clickGame = clickGameRepository.findById(gameId).orElseThrow();

		if(clickGame.getClickCount() >= 1000) {
			throw new IllegalArgumentException("게임 클릭 수 초과");
		}

		// 게임 클릭 수 증가
		clickGame.click();

		// 캐시 차감
		userRepository.useCash(userId, 10);

		// 게임 로그 저장
		clickGameLogRepository.save(ClickGameLog.builder()
			.user(User.builder().id(userId).build())
			.order(clickGame.getClickCount())
			.clickGame(clickGame)
			.build());
	}
}
