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
import com.toudeuk.server.domain.game.repository.ClickGameCacheRepository;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRewardLogRepository;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import com.toudeuk.server.domain.user.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClickGameService {

	private final ClickGameCacheRepository clickCacheRepository;
	private final ClickGameRepository clickGameRepository;
	private final UserRepository userRepository;
	private final ClickGameLogRepository clickGameLogRepository;
	private final ClickGameRewardLogRepository clickGameRewardLogRepository;
	private final ApplicationEventPublisher applicationEventPublisher;

	// 클릭 로그 저장
	@Transactional
	public void saveClickGame() {
		List<Long> clickLogs = clickCacheRepository.getClickLog();

		Long gameId = clickCacheRepository.getGameId();
		ClickGame clickGame = findById(gameId);

		// 저장 하기
		AtomicInteger order = new AtomicInteger(1);
		for (Long userId : clickLogs) {
			User user = userRepository.findById(userId)
				.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

			ClickGameLog clickGameLog = ClickGameLog.create(user, order.getAndIncrement(), clickGame);
			clickGameLogRepository.save(clickGameLog);

			if (order.get() == 12000) {
				int count = clickCacheRepository.getUserClick(userId);
				ClickGameRewardLog rewardLog = ClickGameRewardLog.create(user, clickGame, 10000, count, WINNER);
				clickGameRewardLogRepository.save(rewardLog);
				continue;
			}
			if (order.get() % 1000 == 0) {
				int count = clickCacheRepository.getUserClick(userId);

				ClickGameRewardLog rewardLog = ClickGameRewardLog.create(user, clickGame, 100, count, SECTION);
				clickGameRewardLogRepository.save(rewardLog);
			}
		}

		Long maxClickerId = clickCacheRepository.getMaxClicker();
		int maxCount = clickCacheRepository.getUserClick(maxClickerId);
		User MaxClicker = userRepository.findById(maxClickerId)
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		ClickGameRewardLog rewardLog = ClickGameRewardLog.create(MaxClicker, clickGame, 10000, maxCount, MAX_CLICKER);

		// Redis의 클릭 정보를 삭제
		clickCacheRepository.deleteAllClickInfo();
	}

	@Transactional
	public void clickButton(Long userId) {
		synchronized (userId) {
			clickCacheRepository.addUserClick(userId);

			User user = userRepository.findById(userId)
				.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

			int changeCash = -1;
			int resultCash = user.getCash() - 1;

			applicationEventPublisher.publishEvent(
				new CashLogEvent(user, changeCash, resultCash, "clickGame", CashLogType.GAME));

			user.updateCash(resultCash);
		}
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
				clickGameRewardLogRepository.findWinnerAndMaxClickerByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(WINNER_NOT_FOUND)
				)
			)
		);

	}

	public Page<HistoryData.DetailInfo> getHistoryDetail(Long gameId, Pageable pageable) {
		
		ClickGame clickGame = clickGameRepository.findById(gameId).orElseThrow(
			() -> new BaseException(ClickGame_NOT_FOUND)
		);

		HistoryData.WinnerAndMaxClickerData winnerAndMaxClickerData = clickGameRewardLogRepository.findWinnerAndMaxClickerByClickGameId(
			clickGame.getId()).orElseThrow(
			() -> new BaseException(WINNER_NOT_FOUND)
		);

		List<HistoryData.RewardUser> middleRewardUsers = clickGameRewardLogRepository.findMiddleByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(MIDDLE_NOT_FOUND));

		List<HistoryData.RewardUser> allUsers = clickGameLogRepository.findAllUsersByGameId(gameId).orElseThrow(
			() -> new BaseException(USER_NOT_FOUND));

		return new PageImpl<>(Collections.singletonList(
			HistoryData.DetailInfo.of(
				clickGame,
				winnerAndMaxClickerData,
				middleRewardUsers,
				allUsers
			)
		), pageable, 1);
	}

}
