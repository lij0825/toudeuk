package com.toudeuk.server.domain.game.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import com.toudeuk.server.domain.game.entity.RewardType;
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

	// 게임 시작
	public void startGame(Long gameId) {
		if (clickCacheRepository.isGameCoolTime()) {
			throw new BaseException(COOL_TIME);
		}
		clickCacheRepository.setTotalClick();
	}

	// 클릭
	@Transactional
	public void click(Long userId) {
		if (clickCacheRepository.isUserCoolTime(userId)) {
			throw new BaseException(COOL_TIME);
		}

		clickCacheRepository.addUserClick(userId);
		clickCacheRepository.addTotalClick();
		clickCacheRepository.addLog(userId);
		clickCacheRepository.setUserCoolTime(userId);
	}


	public Integer getUserClick(Long userId) {
		Integer clickCount = clickCacheRepository.getUserClick(userId);
		if (clickCount == null) {
			throw new BaseException(GAME_ERROR);
		}
		return clickCount;
	}

	public Integer getTotalClick() {
		Integer totalClick = clickCacheRepository.getTotalClick();
		if (totalClick == null) {
			throw new BaseException(GAME_ERROR);
		}
		return totalClick;
	}

	public Integer getUserOrder(Long userId) {
		Integer order = clickCacheRepository.getUserOrder(userId);
		if (order == null) {
			throw new BaseException(GAME_ERROR);
		}
		return order;
	}

	public Long getPreviousOrderUser(int clickCount) {
		return clickCacheRepository.getPreviousOrderUser(clickCount).stream().findFirst()
				.orElseThrow(() -> new BaseException(REWARD_USER_NOT_FOUND));
	}


	@Transactional
	public void saveLog(Long gameId) {
		ClickGame clickGame = clickGameRepository.findById(gameId)
				.orElseThrow(() -> new BaseException(GAME_NOT_FOUND));

		List<Long> clickLogs = clickCacheRepository.getLog();
		if (clickLogs == null) {
			throw new BaseException(GAME_LOG_NOT_FOUND);
		}

		int order = 1;
		for (Long userId : clickLogs) {
			User user = userRepository.findById(userId)
					.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

			ClickGameLog clickGameLog = ClickGameLog.create(user, order, clickGame);
			clickGameLogRepository.save(clickGameLog);
		}
	}

	@Transactional
	public void saveReward(Long gameId) {
		ClickGame clickGame = clickGameRepository.findById(gameId)
				.orElseThrow(() -> new BaseException(GAME_NOT_FOUND));

		Long maxClickUserId = clickCacheRepository.getMaxClickUser().stream().findFirst()
				.orElseThrow(() -> new BaseException(REWARD_USER_NOT_FOUND));
		Long winnerId = clickCacheRepository.getWinner();

		if (maxClickUserId == null || winnerId == null) {
			throw new BaseException(REWARD_USER_NOT_FOUND);
		}

		User maxClickUser = userRepository.findById(maxClickUserId)
				.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		User winner = userRepository.findById(winnerId)
				.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		int maxClickCount = clickCacheRepository.getUserClick(maxClickUserId);

		int winnerClickCount = clickCacheRepository.getUserClick(winnerId);

		ClickGameRewardLog maxClickReward = ClickGameRewardLog.create(maxClickUser, clickGame, 1000, maxClickCount, MAX_CLICKER);
		ClickGameRewardLog winnerReward = ClickGameRewardLog.create(winner, clickGame, 10000, winnerClickCount, WINNER);

		clickGameRewardLogRepository.save(maxClickReward);
		clickGameRewardLogRepository.save(winnerReward);


	}


	public Page<HistoryData.AllInfo> getAllHistory(Pageable pageable) {

		return clickGameRepository.findAllByOrderByIdDesc(pageable).map(
			clickGame -> HistoryData.AllInfo.of(
				clickGame,
				clickGameRewardLogRepository.findWinnerAndMaxClickerByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(REWARD_USER_NOT_FOUND)
				)
			)
		);

	}

	public Page<HistoryData.DetailInfo> getHistoryDetail(Long gameId, Pageable pageable) {

		ClickGame clickGame = clickGameRepository.findById(gameId).orElseThrow(
			() -> new BaseException(GAME_NOT_FOUND)
		);

		HistoryData.WinnerAndMaxClickerData winnerAndMaxClickerData = clickGameRewardLogRepository.findWinnerAndMaxClickerByClickGameId(
			clickGame.getId()).orElseThrow(
			() -> new BaseException(REWARD_USER_NOT_FOUND)
		);

		List<HistoryData.RewardUser> middleRewardUsers = clickGameRewardLogRepository.findMiddleByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(REWARD_USER_NOT_FOUND));

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
