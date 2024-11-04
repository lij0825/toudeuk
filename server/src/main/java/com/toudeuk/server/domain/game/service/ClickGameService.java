package com.toudeuk.server.domain.game.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.toudeuk.server.domain.game.dto.GameData;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;
import com.toudeuk.server.domain.game.kafka.ClickProducer;
import com.toudeuk.server.domain.game.repository.ClickGameCacheRepository;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRewardLogRepository;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClickGameService {

	private static final int CLICK_CASH = -1;

	private final ClickGameCacheRepository clickCacheRepository;
	private final ClickGameRepository clickGameRepository;
	private final UserRepository userRepository;
	private final ClickGameLogRepository clickGameLogRepository;
	private final ClickGameRewardLogRepository clickGameRewardLogRepository;
	private final ApplicationEventPublisher applicationEventPublisher;
	private final ClickProducer clickProducer;

	private final SimpMessagingTemplate messagingTemplate;


	// 게임 시작
	@Transactional
	public void checkGame(Long userId) {

		if(clickCacheRepository.existGame()) {
			Long myRank = clickCacheRepository.getUserRank(userId);
			Integer myClickCount = clickCacheRepository.getUserClickCount(userId);
			Long prevUserId = clickCacheRepository.getPrevUserId(myClickCount);
			Integer prevClickCount = prevUserId == null ? -1 : clickCacheRepository.getUserClickCount(prevUserId);
			Integer totalClick = clickCacheRepository.getTotalClick();

			GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.of(
					0L,
					"RUNNING",
					myRank.intValue(),
					myClickCount,
					-1L,
					prevClickCount,
					totalClick
			);

			messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);
			return;
		}

		// 쿨타임이면?
		if (clickCacheRepository.isGameCoolTime()) {
			Long gameCoolTime = clickCacheRepository.getGameCoolTime();
			GameData.DisplayInfoForEvery displayInfoEvery = GameData.DisplayInfoForEvery.of(
					gameCoolTime,
					"COOLTIME",
					0
			);

			GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.of(
					displayInfoEvery,
					0,
					0,
					0L,
					0,
					0
			);

			// 모든 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game", displayInfoEvery);

			// 특정 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);

			return;
		}

		if (clickCacheRepository.waitingGameStart()) {
			GameData.DisplayInfoForEvery displayInfoEvery = GameData.DisplayInfoForEvery.of(
					0L,
					"WAITING",
					0
			);

			GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.of(
					displayInfoEvery,
					0,
					0,
					-1L,
					0,
					0
			);

			// 모든 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game", displayInfoEvery);

			// 특정 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);

			return;
		}
	}

	@Transactional
	public void startGame(Long userId) {

		Long lastRound = clickGameRepository.findLastRound().orElse(0L);
		ClickGame newGame = ClickGame.create(lastRound + 1);
		ClickGame savedGame = clickGameRepository.save(newGame);
		Integer totalClickCount = clickCacheRepository.setTotalClick();
		clickCacheRepository.setGameId(savedGame.getId());

		GameData.DisplayInfoForEvery displayInfoForEvery = GameData.DisplayInfoForEvery.of(
				0L,
				"RUNNING",
				totalClickCount
		);

		GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.of(
				displayInfoForEvery,
				1,
				1,
				-1L,
				0,
				totalClickCount
		);


		// 모든 구독자에게 메시지 전송
		messagingTemplate.convertAndSend("/topic/game", displayInfoForEvery);

		// 특정 구독자에게 메시지 전송
		messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);
	}

	// 클릭
	@Transactional
	public void click(Long userId) {
		if (clickCacheRepository.isGameCoolTime()) {
			throw new BaseException(COOL_TIME);
		}
		if (clickCacheRepository.getGameId() == null) {
			throw new BaseException(GAME_NOT_FOUND);
		}

		// * 클릭시 캐쉬 로직 추가 / 유저 조회 -> 캐쉬 업데이트 이렇게 2번 DB에 접근
		// * resultCash = 유저의 현재 캐쉬 - 클릭당 캐쉬
		// * 이건 너무 구려, 그니까 큐를 사용하자

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		int resultCash = user.getCash() + CLICK_CASH;

		if (resultCash < 0) {
			throw new BaseException(NOT_ENOUGH_CASH);
		}
		user.updateCash(resultCash);

		// * 클릭 시 레디스 캐쉬 로직
		clickCacheRepository.addUserClick(userId);
		clickCacheRepository.addTotalClick();
		clickCacheRepository.addLog(userId);

		if (clickCacheRepository.isGameCoolTime()) {
			Long gameId = clickCacheRepository.getGameId();
			saveLog(gameId);
			saveReward(gameId);
			clickCacheRepository.deleteAllClickInfo();
		}
	}

	public void asyncClick(Long userId) throws JsonProcessingException {
		log.info("카프카 클릭 asyncClick userId : {}", userId);
		clickProducer.occurClickUserId(userId);
	}

	public GameData.DisplayInfoForClicker getGameDisplayData(Long userId) {
		Long myRank = clickCacheRepository.getUserRank(userId);
		Integer myClickCount = clickCacheRepository.getUserClickCount(userId);
		Long prevUserId = clickCacheRepository.getPrevUserId(myClickCount);
		Integer prevClickCount = prevUserId == null ? null : clickCacheRepository.getUserClickCount(prevUserId);
		Integer totalClick = clickCacheRepository.getTotalClick();
		log.info("myRank : {}, myClickCount : {}, prevUserId : {}, prevClickCount : {}, totalClick : {}",
				myRank, myClickCount, prevUserId, prevClickCount, totalClick);
		return GameData.DisplayInfoForClicker.of(
				0L,
				"RUNNING",
				myRank.intValue() +1,
				myClickCount,
				prevUserId,
				prevClickCount,
				totalClick
		);
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

		log.info("clickLogs : {}", clickLogs);

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

		Long maxClickUserId = clickCacheRepository.getMaxClickUserId();
		Long winnerId = clickCacheRepository.getWinner();

		if (maxClickUserId == null || winnerId == null) {
			throw new BaseException(REWARD_USER_NOT_FOUND);
		}

		// FIXME : 같은 레포지토리에 조회 쿼리를 두번 날리는 거 한번에 가져오게 수정하기, DB 왕복 줄이기

		// User maxClickUser = userRepository.findById(maxClickUserId)
		// 		.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		// User winner = userRepository.findById(winnerId)
		// 		.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		List<User> users = userRepository.findAllById(List.of(maxClickUserId, winnerId));

		Map<Long, User> userMap = users.stream()
			.collect(Collectors.toMap(User::getId,
				Function.identity())); // * Function.identity()은 입력을 그대로 반환하는 함수 User 넣으면 User 반환

		User maxClickUser = Optional.ofNullable(userMap.get(maxClickUserId))
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		User winner = Optional.ofNullable(userMap.get(winnerId))
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		int maxClickCount = clickCacheRepository.getUserClickCount(maxClickUserId);

		int winnerClickCount = clickCacheRepository.getUserClickCount(winnerId);

		ClickGameRewardLog maxClickReward = ClickGameRewardLog.create(maxClickUser, clickGame, 1000, maxClickCount,
			MAX_CLICKER);
		ClickGameRewardLog winnerReward = ClickGameRewardLog.create(winner, clickGame, 10000, winnerClickCount, WINNER);

		clickGameRewardLogRepository.save(maxClickReward);
		clickGameRewardLogRepository.save(winnerReward);

		// * 게임 참가자들의 모든 캐쉬 로그 찍어줘야함
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
