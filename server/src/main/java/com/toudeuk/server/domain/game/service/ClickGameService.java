package com.toudeuk.server.domain.game.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;
import com.toudeuk.server.domain.game.repository.ClickCacheRepository;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRewardLogRepository;
import com.toudeuk.server.domain.game.repository.GameCacheRepository;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import com.toudeuk.server.domain.user.repository.UserRepository;
import com.toudeuk.server.domain.user.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClickGameService {

	private final ClickCacheRepository clickCacheRepository;
	private final GameCacheRepository gameCacheRepository;
	private final ClickGameRepository clickGameRepository;
	private final UserService userService;
	private final UserRepository userRepository;
	private final ClickGameLogRepository clickGameLogRepository;
	private final ClickGameRewardLogRepository clickGameRewardLogRepository;
	private final ApplicationEventPublisher applicationEventPublisher;

	// 클릭 로그 저장
	@Transactional
	public void saveClickGame() {
		List<Object> clickLogs = clickCacheRepository.getClickLog();

		Long gameId = gameCacheRepository.getGameId();
		ClickGame clickGame = clickGameRepository.findById(gameId).orElseThrow(
			() -> new BaseException(ClickGame_NOT_FOUND)
		);

		// 저장 하기
		AtomicInteger order = new AtomicInteger(1);
		for (Object userId : clickLogs) {
			User user = userRepository.findById((Long)userId).orElseThrow(
				() -> new BaseException(USER_NOT_FOUND)
			);

			ClickGameLog clickGameLog = ClickGameLog.create(user, order.getAndIncrement(), clickGame);
			clickGameLogRepository.save(clickGameLog);

			if (order.get() == 12000) {
				int count = clickCacheRepository.getUserClick((Long)userId);
				ClickGameRewardLog rewardLog = ClickGameRewardLog.create(user, clickGame, 10000, count, WINNER);
				continue;
			}
			if (order.get() % 1000 == 0) {
				int count = clickCacheRepository.getUserClick((Long)userId);

				ClickGameRewardLog rewardLog = ClickGameRewardLog.create(user, clickGame, 100, count, SECTION);
				clickGameRewardLogRepository.save(rewardLog);
			}
		}

		Long maxClickerId = clickCacheRepository.getMaxClicker();
		int maxCount = clickCacheRepository.getUserClick((Long)maxClickerId);
		User MaxClicker = userRepository.findById(maxClickerId).orElseThrow(
			() -> new BaseException(USER_NOT_FOUND)
		);
		ClickGameRewardLog rewardLog = ClickGameRewardLog.create(MaxClicker, clickGame, 10000, maxCount, MAX_CLICKER);

		// Redis의 클릭 정보를 삭제
		clickCacheRepository.deleteAllClickInfo();
	}

	public void clickButton(Long userId) {
		clickCacheRepository.addUserClick(userId);

		User user = userRepository.findById(userId).orElseThrow(
			() -> new BaseException(USER_NOT_FOUND)
		);
		int changeCash = -1;
		int resultCash = user.getCash() - 1;

		applicationEventPublisher.publishEvent(
			new CashLogEvent(user, changeCash, resultCash, "clickGame", CashLogType.GAME));

		user.updateCash(resultCash);
	}

	public ClickGame findById(Long id) {
		ClickGame findClickGame = clickGameRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException(ClickGame_NOT_FOUND.getMessage()));

		return findClickGame;
	}

	public Page<HistoryData.AllInfo> getAllHistory(Pageable pageable) {

		return clickGameRepository.findAllByOrderByIdDesc(pageable).map(
			clickGame -> HistoryData.AllInfo.of(
				clickGame,
				clickGameRewardLogRepository.findWinnerByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(WINNER_NOT_FOUND)
				),
				clickGameRewardLogRepository.findWinnerClickCountByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(WINNER_NOT_FOUND)
				),
				clickGameRewardLogRepository.findMaxClickerByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(MAX_CLICKER_NOT_FOUND)
				),
				clickGameRewardLogRepository.findMaxClickerClickCountByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(MAX_CLICKER_NOT_FOUND)
				)
			)
		);

	}

	public Page<HistoryData.DetailInfo> getHistoryDetail(Long gameId, Pageable pageable) {
		ClickGame clickGame = findById(gameId);

		User winner = clickGameRewardLogRepository.findWinnerByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(WINNER_NOT_FOUND));
		int winnerClickCount = clickGameRewardLogRepository.findWinnerClickCountByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(WINNER_NOT_FOUND));

		User maxClicker = clickGameRewardLogRepository.findMaxClickerByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(MAX_CLICKER_NOT_FOUND));
		int maxClickerClickCount = clickGameRewardLogRepository.findMaxClickerClickCountByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(MAX_CLICKER_NOT_FOUND));

		List<User> middleRewardUsers = clickGameRewardLogRepository.findMiddleByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(MIDDLE_NOT_FOUND));

		// 모든 사용자 (게임 로그를 사용하여 조회)
		List<User> allUsers = clickGameLogRepository.findAllUsersByGameId(gameId).orElseThrow(
			() -> new BaseException(USER_NOT_FOUND)
		);

		// DTO로 변환
		return new PageImpl<>(Collections.singletonList(
			HistoryData.DetailInfo.of(
				clickGame,
				winner,
				winnerClickCount,
				maxClicker,
				maxClickerClickCount,
				middleRewardUsers,
				allUsers
			)
		), pageable, 1); // 페이지를 구성하기 위해 반환
	}

}
