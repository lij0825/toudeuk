package com.toudeuk.server.domain.game.controller.service;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.user.entity.RoleType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;

@SpringBootTest
class GameServiceTest {

	@Autowired
	private ClickGameRepository clickGameRepository;

	@Autowired
	private ClickGameLogRepository clickGameLogRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private GameService gameService;

	@BeforeEach
	public void init() {
		clickGameRepository.deleteAll();
		clickGameLogRepository.deleteAll();
		userRepository.deleteAll();
	}

	@Test
	public void 테스트() throws InterruptedException {
		User user = User.builder()
			.id(1L)
			.email("test@naver.com")
			.name("테스트")
			.nickname("테스트")
			.phoneNumber("010-1234-5678")
			.cash(10000000)
			.roleType(RoleType.USER)
			.build();
		userRepository.save(user);

		ClickGame clickGame = ClickGame.builder()
			.id(1L)
			.round(1L)
			.clickCount(0)
			.build();
		clickGameRepository.save(clickGame);

		int threadCount = 1500;

		ExecutorService executorService = Executors.newFixedThreadPool(100);
		CountDownLatch latch = new CountDownLatch(threadCount);

		for (int i = 0 ; i < threadCount ; i++) {
			executorService.submit(() -> {
				try{
					gameService.click(user.getId(), clickGame.getId());
				} finally {
					latch.countDown();
				}
			});
		}
		latch.await();

		Assertions.assertThat(
				clickGameRepository.findById(1L).get().getClickCount())
			.isEqualTo(1000L);

	}
}