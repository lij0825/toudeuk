package com.toudeuk.server.domain.game.controller.service;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.game.service.GameService;
import com.toudeuk.server.domain.game.service.OptimistickLockGameFacade;
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
	@Autowired
	private OptimistickLockGameFacade optimistickLockGameFacade;

	@BeforeEach
	public void before() {
		clickGameLogRepository.deleteAll();
		clickGameRepository.deleteAll();
		userRepository.deleteAll();
	}

	@Test
	public void 락을_걸지않은_테스트() throws InterruptedException {
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

		ClickGame clickGame = new ClickGame(1L, 1L, 0);
		clickGameRepository.save(clickGame);

		int threadCount = 1500;

		ExecutorService executorService = Executors.newFixedThreadPool(10);
		CountDownLatch latch = new CountDownLatch(threadCount);

		for (int i = 0; i < threadCount; i++) {

			executorService.submit(() -> {
				try {
					gameService.NoLockingClick(user.getId(), clickGame.getId());
				} finally {
					latch.countDown();
				}
			});
		}
		latch.await();

		ClickGame resultGame = clickGameRepository.findById(clickGame.getId()).orElseThrow();

		Assertions.assertThat(resultGame.getClickCount()).isEqualTo(1000L);
	}

	@Test
	public void 비관적_락_테스트() throws InterruptedException {

		User user =  userRepository.save(User.builder()
			.email("test@naver.com")
			.name("테스트")
			.nickname("테스트")
			.phoneNumber("010-1234-5678")
			.cash(10000000)
			.roleType(RoleType.USER)
			.build());

		ClickGame clickGame = clickGameRepository.save(new ClickGame(1L, 1L, 0));

		int threadCount = 1500;

		ExecutorService executorService = Executors.newFixedThreadPool(32);
		CountDownLatch latch = new CountDownLatch(threadCount);
		AtomicInteger error = new AtomicInteger(0);


		for (int i = 0; i < threadCount; i++) {

			executorService.submit(() -> {
				try {
					gameService.pessimisticClick(user.getId(), clickGame.getId());
				} catch (IllegalArgumentException e) {
					error.incrementAndGet();
				}
				finally {
					latch.countDown();
				}
			});
		}
		latch.await();

		ClickGame resultGame = clickGameRepository.findById(clickGame.getId()).orElseThrow();

		Assertions.assertThat(
			clickGameLogRepository.count()
			).isEqualTo(1000);

		Assertions.assertThat(error.get()).isEqualTo(500);
	}

	@Test
	public void 낙관적_락_테스트() throws InterruptedException {
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

		ClickGame clickGame = new ClickGame(1L, 1L, 0);

		clickGameRepository.save(clickGame);

		int threadCount = 1500;

		ExecutorService executorService = Executors.newFixedThreadPool(32);
		CountDownLatch latch = new CountDownLatch(threadCount);

		for (int i = 0; i < threadCount; i++) {

			executorService.submit(() -> {

				try {
					optimistickLockGameFacade.click(user.getId(), clickGame.getId());
				} catch (InterruptedException e) {
					throw new RuntimeException(e);
				} finally {
					latch.countDown();
				}
			});
		}
		latch.await();

		ClickGame resultGame = clickGameRepository.findById(clickGame.getId()).orElseThrow();

		Assertions.assertThat(resultGame.getClickCount()).isEqualTo(1000L);
	}

	@Test
	public void 비관적_락_트리거_테스트() throws InterruptedException {
		User user = userRepository.save(User.builder()
			.id(1L)
			.email("test@naver.com")
			.name("테스트")
			.nickname("테스트")
			.phoneNumber("010-1234-5678")
			.cash(10000000)
			.roleType(RoleType.USER)
			.build());

		ClickGame clickGame = clickGameRepository.save(new ClickGame(1L, 1L, 0));

		int threadCount = 1500;

		ExecutorService executorService = Executors.newFixedThreadPool(32);
		CountDownLatch latch = new CountDownLatch(threadCount);

		for (int i = 0; i < threadCount; i++) {

			executorService.submit(() -> {
				try {
					gameService.pessimisticAndTriggerClick((user.getId()), clickGame.getId());
				} finally {
					latch.countDown();
				}
			});
		}
		latch.await();

		ClickGame resultGame = clickGameRepository.findById(clickGame.getId()).orElseThrow();

		Assertions.assertThat(
			userRepository.findById(user.getId()).orElseThrow().getCash()
			).isEqualTo(9990000);
	}

}