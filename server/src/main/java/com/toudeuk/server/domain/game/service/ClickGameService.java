package com.toudeuk.server.domain.game.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.game.dto.GameData;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.dto.RankData;
import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;
import com.toudeuk.server.domain.game.entity.RewardType;
import com.toudeuk.server.core.kafka.Producer;
import com.toudeuk.server.core.kafka.dto.KafkaClickDto;
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
	private static final int FIRST_CLICK_REWARD = 500;

    private final ClickGameCacheRepository clickCacheRepository;
    private final ClickGameRepository clickGameRepository;
    private final UserRepository userRepository;
    private final ClickGameLogRepository clickGameLogRepository;
    private final ClickGameRewardLogRepository clickGameRewardLogRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final Producer producer;

	private final SimpMessagingTemplate messagingTemplate;

	// 게임 시작
	@Transactional
	public void checkGame(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
		Integer userCash = clickCacheRepository.getUserCash(userId);
		user.setCash(userCash);
		userRepository.save(user);
		log.info("======================================checkGame 실행======================================");
		// 쿨타임이면?
		if (clickCacheRepository.isGameCoolTime()) {
			String gameCoolTime = clickCacheRepository.getGameCoolTime();
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

			log.info("======================================쿨타임이면 실행======================================");
			// 모든 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game", displayInfoEvery);
			// 특정 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);

			return;
		}

		if (clickCacheRepository.existGame()) {
			Long myRank = clickCacheRepository.getUserRank(userId);
			Integer myClickCount = clickCacheRepository.getUserClickCount(userId);
			Long prevUserId = clickCacheRepository.getPrevUserId(myClickCount);
			Integer prevClickCount = prevUserId == null ? -1 : clickCacheRepository.getUserClickCount(prevUserId);
			Integer totalClick = clickCacheRepository.getTotalClick();

			log.info("게임 실행 중이기 떄문에 관련정보들을 발행해야합니다.");

			GameData.DisplayInfoForEvery displayInfoEvery = GameData.DisplayInfoForEvery.of(
				"RUNNING",
				"RUNNING",
				totalClick
			);

			GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.of(
				"RUNNING",
				"RUNNING",
				myRank.intValue(),
				myClickCount,
				-1L,
				prevClickCount,
				totalClick
			);

			messagingTemplate.convertAndSend("/topic/game", displayInfoEvery);
			log.info("displayInfoEvery : {}", displayInfoEvery);
			messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);
			log.info("displayInfoForClicker : {}", displayInfoForClicker);

			log.info("======================================게임중이면 실행======================================");

			return;
		}
	}

	@Transactional
	public void click(Long userId) throws JsonProcessingException {

		// 쿨타임이면?
		if (clickCacheRepository.isGameCoolTime()) {

			String gameCoolTime = clickCacheRepository.getGameCoolTime();
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

			throw new BaseException(COOL_TIME);
		}

		Integer userCash = clickCacheRepository.getUserCash(userId);

		int result = userCash + CLICK_CASH;
		// 돈없으면 끝
		if (result < 0) {
			throw new BaseException(NOT_ENOUGH_CASH);
		}

		clickCacheRepository.updateUserCash(userId, CLICK_CASH);

		Integer userClickCount = clickCacheRepository.addUserClick(userId);
		Long totalClickCount = clickCacheRepository.addTotalClick();

		//!  여기서 보상을 결정하고 레디스에 넣는 작업을 끝내야함, 이휴 컨슈머에서는 오로지 MYSQL만 건들도록
		KafkaClickDto clickDto = new KafkaClickDto(
			userId,
			clickCacheRepository.getGameId(),
			totalClickCount.intValue(),
			getRewardType(totalClickCount.intValue())
		);

		// 첫번째 클릭자 보상
		if (clickDto.getRewardType().equals(FIRST)) {
			clickCacheRepository.reward(userId, FIRST_CLICK_REWARD);
		}

		// 중간 클릭자, 우승자
		if (clickDto.getRewardType().equals(SECTION) || clickDto.getRewardType().equals(WINNER)) {
			int reward = totalClickCount.intValue();
			clickCacheRepository.reward(userId, reward);
		}



        producer.occurClickUserId(clickDto);

		GameData.DisplayInfoForEvery displayInfoForEvery = GameData.DisplayInfoForEvery.of(
			"RUNNING",
			"RUNNING",
			totalClickCount.intValue()
		);

		GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.of(
			displayInfoForEvery,
			0,
			0,
			-1L,
			0,
			userClickCount
		);

		// 모든 구독자에게 메시지 전송
		messagingTemplate.convertAndSend("/topic/game", displayInfoForEvery);

		// 특정 구독자에게 메시지 전송
		messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);

		if (clickCacheRepository.isGameCoolTime()) {
			log.info("게임 종료");

			// * 완료 게임 삭제
			log.info("clickCacheRepository.deleteAllClickInfo() 실행 전");
			clickCacheRepository.deleteAllClickInfo();
			log.info("clickCacheRepository.deleteAllClickInfo() 실행 후");
			// * 다음 게임 생성
			Long lastRound = clickGameRepository.findLastRound().orElse(0L);
			ClickGame newGame = ClickGame.create(lastRound + 1);
			ClickGame savedGame = clickGameRepository.save(newGame);
			clickCacheRepository.setTotalClick();
			clickCacheRepository.setGameId(savedGame.getId());
		}
	}

	@Transactional
	public void saveGameData(KafkaClickDto clickDto) {
		Long userId = clickDto.getUserId();
		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		ClickGame clickGame = clickGameRepository.findById(clickDto.getGameId())
			.orElseThrow(() -> new BaseException(GAME_NOT_FOUND));
		Integer totalClickCount = clickDto.getTotalClickCount();

		ClickGameLog clickGameLog = ClickGameLog.create(user, totalClickCount, clickGame);

		// 게임 로그 저장
		clickGameLogRepository.save(clickGameLog);

		// 첫번째 클릭자 보상
		if (clickDto.getRewardType().equals(FIRST)) {
			ClickGameRewardLog clickGameRewardLog = ClickGameRewardLog.create(user, clickGame, FIRST_CLICK_REWARD,
				totalClickCount, SECTION);
			clickGameRewardLogRepository.save(clickGameRewardLog);
		}

		// 중간 클릭자, 우승자
		if (clickDto.getRewardType().equals(SECTION) || clickDto.getRewardType().equals(WINNER)) {
			int reward = totalClickCount / 2;
			ClickGameRewardLog clickGameRewardLog = ClickGameRewardLog.create(user, clickGame, reward, totalClickCount,
				clickDto.getRewardType());
			clickGameRewardLogRepository.save(clickGameRewardLog);
		}
	}

	public RewardType getRewardType(int totalClickCount) {

		if (totalClickCount == 1) {
			return RewardType.FIRST;
		}

		if (totalClickCount % 100 == 0) {
			return RewardType.SECTION;
		}

		if (totalClickCount == 1000) {
			return RewardType.WINNER;
		}

		return RewardType.NONE;
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

	@Transactional
	public void startGame(Long userId) {
		if (clickCacheRepository.existGame()) {
			throw new BaseException(GAME_ALREADY_EXIST);
		}

		Long lastRound = clickGameRepository.findLastRound().orElse(0L);
		ClickGame newGame = ClickGame.create(lastRound + 1);
		ClickGame savedGame = clickGameRepository.save(newGame);
		Integer totalClickCount = clickCacheRepository.setTotalClick();
		clickCacheRepository.setGameId(savedGame.getId());

		GameData.DisplayInfoForEvery displayInfoForEvery = GameData.DisplayInfoForEvery.of(
			"RUNNING",
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

	public Page<HistoryData.DetailLog> getHistoryDetail(Long gameId, Pageable pageable) {

        Page<ClickGameLog> clickGameLogs = clickGameLogRepository.findByGameId(gameId, pageable);

        return clickGameLogs.map(clickGameLog ->
            HistoryData.DetailLog.of(clickGameLog, clickGameLog.getUser())
        );

	}

	public RankData.Result getRankingList() {
		Set<ZSetOperations.TypedTuple<Long>> rankSet = clickCacheRepository.getRankingList();

		Long gameId = clickCacheRepository.getGameId();

		List<RankData.RankList> rankList = new ArrayList<>();
		int rank = 1;
		for (ZSetOperations.TypedTuple<Long> ranking : rankSet) {
			Long userId = ranking.getValue();
			User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
			rankList.add(
				RankData.RankList.of(rank, user.getNickname(), user.getProfileImg(), ranking.getScore().intValue()));
			rank++;
		}
		RankData.Result result = RankData.Result.of(gameId, rankList);
		return result;

	}

	public HistoryData.RewardInfo getHistoryReward(Long gameId) {

		ClickGame clickGame = clickGameRepository.findById(gameId).orElseThrow(
			() -> new BaseException(GAME_NOT_FOUND)
		);

		HistoryData.WinnerAndMaxClickerData winnerAndMaxClickerData = clickGameRewardLogRepository.findWinnerAndMaxClickerByClickGameId(
			clickGame.getId()).orElseThrow(
			() -> new BaseException(REWARD_USER_NOT_FOUND)
		);

		List<HistoryData.RewardUser> middleRewardUsers = clickGameRewardLogRepository.findMiddleByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(REWARD_USER_NOT_FOUND));

		return HistoryData.RewardInfo.of(
			winnerAndMaxClickerData,
			middleRewardUsers
		);

	}
}
