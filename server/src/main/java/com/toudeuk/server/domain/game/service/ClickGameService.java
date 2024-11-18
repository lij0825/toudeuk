package com.toudeuk.server.domain.game.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.kafka.Producer;
import com.toudeuk.server.core.kafka.dto.KafkaClickDto;
import com.toudeuk.server.core.kafka.dto.KafkaGameCashLogDto;
import com.toudeuk.server.domain.game.dto.GameData;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.dto.RankData;
import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;
import com.toudeuk.server.domain.game.entity.RewardType;
import com.toudeuk.server.domain.game.repository.ClickGameCacheRepository;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRewardLogRepository;
import com.toudeuk.server.domain.user.entity.CashLog;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.CashLogRepository;
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
	private static final int MAX_CLICK_REWARD = 500;
	private static final long MAX_CLICK = 1000; // 12000

	private final ClickGameCacheRepository clickCacheRepository;
	private final ClickGameRepository clickGameRepository;
	private final UserRepository userRepository;
	private final ClickGameLogRepository clickGameLogRepository;
	private final ClickGameRewardLogRepository clickGameRewardLogRepository;
	private final ApplicationEventPublisher applicationEventPublisher;
	private final Producer producer;
	private final SimpMessagingTemplate messagingTemplate;
	private final KafkaTemplate kafkaTemplate;
	private final CashLogRepository cashLogRepository;
	private final ClickGameCacheRepository clickGameCacheRepository;

	// 게임 시작
	@Transactional
	public GameData.DisplayInfoForClicker checkGame(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
		Integer userCash = clickCacheRepository.getUserCash(userId);
		user.setCash(userCash);
		userRepository.save(user);
		log.info("======================================checkGame 실행======================================");
		// 쿨타임이면?
		if (clickCacheRepository.isGameCoolTime()) {
			LocalDateTime gameCoolTime = clickCacheRepository.getGameCoolTime();
			GameData.DisplayInfoForEvery displayInfoEvery = GameData.DisplayInfoForEvery.getDisplayInfoEveryAtCoolTime(
				gameCoolTime);

			GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.getDisplayInfoForClickerAtCoolTime(
				displayInfoEvery);

			log.info("======================================쿨타임이면 실행======================================");
			// 모든 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game", displayInfoEvery);
			// 특정 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);

			return displayInfoForClicker;
		}

		clickCacheRepository.setUsername(userId, user.getNickname());
		Integer myRank = clickCacheRepository.getUserRank(userId);
		Integer myClickCount = clickCacheRepository.getUserClickCount(userId);
		Integer totalClick = clickCacheRepository.getTotalClick();
		String latestClicker = clickCacheRepository.getUsername(userId);
		List<RankData.UserScore> rankingList = clickCacheRepository.getRankingList();

		Long gameId = clickCacheRepository.getGameId();

		log.info("게임 실행 중이기 떄문에 관련정보들을 발행해야합니다.");

		GameData.DisplayInfoForEvery displayInfoEvery = GameData.DisplayInfoForEvery.getDisplayInfoForEveryAtRunning(
			totalClick, latestClicker, rankingList, gameId);

		GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.getDisplayInfoForClickerAtRunning(
			displayInfoEvery, myRank, myClickCount, NONE);

		messagingTemplate.convertAndSend("/topic/game", displayInfoEvery);
		log.info("displayInfoEvery : {}", displayInfoEvery);
		// messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);
		// log.info("displayInfoForClicker : {}", displayInfoForClicker);

		log.info("======================================게임중이면 실행======================================");

		return displayInfoForClicker;
	}

	@Transactional
	public GameData.DisplayInfoForClicker click(Long userId) throws JsonProcessingException {

		// 쿨타임이면?
		if (clickCacheRepository.isGameCoolTime()) {

			LocalDateTime gameCoolTime = clickCacheRepository.getGameCoolTime();
			GameData.DisplayInfoForEvery displayInfoEvery = GameData.DisplayInfoForEvery.getDisplayInfoEveryAtCoolTime(
				gameCoolTime);

			GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.getDisplayInfoForClickerAtCoolTime(
				displayInfoEvery);

			// 모든 구독자에게 메시지 전송
			messagingTemplate.convertAndSend("/topic/game", displayInfoEvery);
			// ! 특정 구독자에게 메시지 전송 -> Http방식으로 변경
			// messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);

			return displayInfoForClicker;
		}

		Integer userCash = clickCacheRepository.getUserCash(userId);
		int result = userCash + CLICK_CASH;
		// 돈없으면 끝
		if (result < 0) {
			throw new BaseException(NOT_ENOUGH_CASH);
		}

		Integer totalClick = clickCacheRepository.addTotalClick();
		// ! 테스트 용
		if (totalClick > MAX_CLICK) {
			throw new BaseException(GAME_END);
		}

		clickCacheRepository.updateUserCash(userId, CLICK_CASH);

		Integer userClick = clickCacheRepository.addUserClick(userId);
		// 최초 클릭자라면 => username이라는 키값을 가지고 있지 않으므로 설정해줘야한다.
		if (userClick == -1) {
			User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
			String nickname = user.getNickname();
			clickCacheRepository.setUsername(userId, nickname);
			userClick = clickCacheRepository.addUserClick(userId);
		}

		Integer userRank = clickCacheRepository.getUserRank(userId);
		List<RankData.UserScore> rankingList = clickCacheRepository.getRankingList();
		String latestClicker = clickCacheRepository.getUsername(userId);
		RewardType rewardType = RewardType.from(totalClick);

		Long gameId = clickCacheRepository.getGameId();

		//!  여기서 보상을 결정하고 레디스에 넣는 작업을 끝내야함, 이휴 컨슈머에서는 오로지 MYSQL만 건들도록
		KafkaClickDto clickDto = new KafkaClickDto(
			userId,
			gameId,
			totalClick.intValue(),
			rewardType
		);

		// 첫번째 클릭자 보상
		if (rewardType.equals(FIRST)) {
			clickCacheRepository.reward(userId, FIRST_CLICK_REWARD);
			clickGameCacheRepository.deleteRewardInfo();
			clickGameCacheRepository.setFirstClicker(userId);
		}

		// 중간 클릭자
		if (rewardType.equals(SECTION)) {
			int reward = totalClick.intValue();
			clickCacheRepository.reward(userId, reward);
			clickCacheRepository.addMiddleReward(userId, totalClick.longValue());
		}

		// 우승자
		if (rewardType.equals(WINNER)) {
			int reward = totalClick.intValue();
			clickCacheRepository.reward(userId, reward);
			clickGameCacheRepository.setWinner(userId);
		}

		producer.occurClickUserId(clickDto);

		GameData.DisplayInfoForEvery displayInfoForEvery = GameData.DisplayInfoForEvery.getDisplayInfoForEveryAtRunning(
			totalClick, latestClicker, rankingList, gameId);

		GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.getDisplayInfoForClickerAtRunning(
			displayInfoForEvery, userRank, userClick, rewardType);

		// ! 특정 구독자에게 메시지 전송 -> Http방식으로 변경
		// messagingTemplate.convertAndSend("/topic/game/" + userId, displayInfoForClicker);

		if (rewardType.equals(WINNER)) {
			clickCacheRepository.setGameCoolTime();
			log.info("게임 종료");

			// * 카프카로 유저들 클릭수 전송

			List<KafkaGameCashLogDto> allClickCounts = clickCacheRepository.getAllClickCounts(gameId);

			producer.occurGameCashLog(allClickCounts);

			// 최대 클릭 보상
			Long maxClick = rankingList.get(0).getScore();
			List<String> maxClickerList = clickCacheRepository.getMaxClickerList(maxClick);
			User maxClicker = clickGameLogRepository.findFirstMaxClicker(maxClickerList).get(0);
			ClickGame clickGame = clickGameRepository.findById(gameId)
				.orElseThrow(() -> new BaseException(SAVING_GAME_ERROR));
			ClickGameRewardLog clickGameRewardLog = ClickGameRewardLog.create(maxClicker, clickGame, MAX_CLICK_REWARD,
				maxClick.intValue(), MAX_CLICKER);
			clickGameRewardLogRepository.save(clickGameRewardLog);
			clickCacheRepository.reward(maxClicker.getId(), MAX_CLICK_REWARD);
			clickCacheRepository.setMaxClicker(maxClicker.getId());
			//! 게임 종료시 유저 캐시로그들 저장하기

			// * 완료 게임 삭제
			log.info("clickCacheRepository.deleteAllClickInfo() 실행 전");
			clickCacheRepository.deleteAllClickInfo();
			log.info("clickCacheRepository.deleteAllClickInfo() 실행 후");

			// * 보상자들 리턴

			// * 다음 게임 생성
			Long lastRound = clickGameRepository.findLastRound().orElse(0L);
			ClickGame newGame = ClickGame.create(lastRound + 1);
			ClickGame savedGame = clickGameRepository.save(newGame);
			clickCacheRepository.setTotalClick();
			clickCacheRepository.setGameId(savedGame.getId());

		}

		// 모든 구독자에게 메시지 전송
		messagingTemplate.convertAndSend("/topic/game", displayInfoForEvery);

		return displayInfoForClicker;
	}

	@Transactional
	public void saveGameCashLog(List<KafkaGameCashLogDto> gameCashLogs) {
		List<CashLog> cashLogs = gameCashLogs.stream()
			.map(gameCashLogDto ->
				CashLog.create(
					userRepository.findById(gameCashLogDto.getUserId())
						.orElseThrow(() -> new BaseException(USER_NOT_FOUND)),
					gameCashLogDto.getChangeCash(),
					gameCashLogDto.getResultCash(),
					"게임 " + gameCashLogDto.getGameId() + "회차",
					CashLogType.GAME
				)).toList();

		cashLogRepository.saveAll(cashLogs);
	}

	@Transactional
	public void saveGameData(KafkaClickDto clickDto) {
		Long userId = clickDto.getUserId();
		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		ClickGame clickGame = clickGameRepository.findById(clickDto.getGameId())
			.orElseThrow(() -> new BaseException(GAME_NOT_FOUND));
		Integer totalClick = clickDto.getTotalClickCount();
		RewardType rewardType = RewardType.from(totalClick);

		ClickGameLog clickGameLog = ClickGameLog.create(user, totalClick, clickGame);

		// 게임 로그 저장
		clickGameLogRepository.save(clickGameLog);

		// 첫번째 클릭자 보상
		if (rewardType.equals(FIRST)) {
			ClickGameRewardLog clickGameRewardLog = ClickGameRewardLog.create(user, clickGame, FIRST_CLICK_REWARD,
				totalClick, FIRST);
			clickGameRewardLogRepository.save(clickGameRewardLog);
			cashLogRepository.save(
				CashLog.create(user, FIRST_CLICK_REWARD, user.getCash() + FIRST_CLICK_REWARD,
					clickGame.getRound() + "회차 게임 " + totalClick + "번째 클릭자", CashLogType.REWARD)
			);
		}

		// 중간 클릭자, 우승자
		if (rewardType.equals(SECTION) || rewardType.equals(WINNER)) {
			int reward = totalClick / 2;
			ClickGameRewardLog clickGameRewardLog = ClickGameRewardLog.create(user, clickGame, reward, totalClick,
				clickDto.getRewardType());
			clickGameRewardLogRepository.save(clickGameRewardLog);
			cashLogRepository.save(
				CashLog.create(user, reward, user.getCash() + reward,
					clickGame.getRound() + "회차 게임 " + totalClick + "번째 클릭자", CashLogType.REWARD)
			);
		}
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
		Integer totalClick = clickCacheRepository.setTotalClick();
		List<RankData.UserScore> rankingList = clickCacheRepository.getRankingList();
		String latestClicker = clickCacheRepository.getUsername(userId);
		clickCacheRepository.setGameId(savedGame.getId());
		RewardType rewardType = from(totalClick);

		Long gameId = clickCacheRepository.getGameId();

		GameData.DisplayInfoForEvery displayInfoForEvery = GameData.DisplayInfoForEvery.getDisplayInfoForEveryAtRunning(
			totalClick, latestClicker, rankingList, gameId);

		GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.getDisplayInfoForClickerAtRunning(
			displayInfoForEvery, 1, 1, rewardType);

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

	// public RankData.Result getRankingList() {
	//     Set<ZSetOperations.TypedTuple<Long>> rankSet = clickCacheRepository.getRankingList();
	//
	//     Long gameId = clickCacheRepository.getGameId();
	//
	//     List<RankData.RankList> rankList = new ArrayList<>();
	//     int rank = 1;
	//     for (ZSetOperations.TypedTuple<Long> ranking : rankSet) {
	//         Long userId = ranking.getValue();
	//         User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
	//         rankList.add(RankData.RankList.of(rank, user.getNickname(), user.getProfileImg(), ranking.getScore().intValue()));
	//         rank++;
	//     }
	//     RankData.Result result = RankData.Result.of(gameId, rankList);
	//     return result;

	public HistoryData.RewardInfo getHistoryReward(Long gameId) {

		ClickGame clickGame = clickGameRepository.findById(gameId).orElseThrow(
			() -> new BaseException(GAME_NOT_FOUND)
		);

		HistoryData.WinnerAndMaxClickerAndFirstClickerData winnerAndMaxClickerAndFirstClicker = clickGameRewardLogRepository.findWinnerAndMaxClickerByClickGameId(
			clickGame.getId()).orElseThrow(
			() -> new BaseException(REWARD_USER_NOT_FOUND)
		);

		List<HistoryData.RewardUser> middleRewardUsers = clickGameRewardLogRepository.findMiddleByClickGameId(gameId)
			.orElseThrow(() -> new BaseException(REWARD_USER_NOT_FOUND));

		return HistoryData.RewardInfo.of(
			winnerAndMaxClickerAndFirstClicker,
			middleRewardUsers
		);
	}

	public HistoryData.RewardInfo getRecentHistoryReward() {

		HistoryData.RewardUser winner = HistoryData.RewardUser.of(
			userRepository.findById(clickGameCacheRepository.getWinner()).orElseThrow(
				() -> new BaseException(USER_NOT_FOUND)
			),
			1000,
			WINNER
		);

		HistoryData.RewardUser firstClicker = HistoryData.RewardUser.of(
			userRepository.findById(clickGameCacheRepository.getFirstClicker()).orElseThrow(
				() -> new BaseException(USER_NOT_FOUND)
			),
			500,
			FIRST
		);

		HistoryData.RewardUser maxClicker = HistoryData.RewardUser.of(
			userRepository.findById(clickGameCacheRepository.getMaxClicker()).orElseThrow(
				() -> new BaseException(USER_NOT_FOUND)
			),
			500,
			MAX_CLICKER
		);

		HistoryData.WinnerAndMaxClickerAndFirstClickerData winnerAndMaxClickerAndFirstClicker = HistoryData.WinnerAndMaxClickerAndFirstClickerData.of(
			winner,
			maxClicker,
			firstClicker
		);

		Map<Long, Long> middleReward = clickGameCacheRepository.getMiddleReward();

		List<HistoryData.RewardUser> middleRewardUsers = middleReward.entrySet().stream()
			.map(entry -> {
				Long clickCount = entry.getKey();
				Long userId = entry.getValue();
				return HistoryData.RewardUser.of(
					userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND)),
					clickCount.intValue(),
					SECTION
				);
			})
			.toList();

		return HistoryData.RewardInfo.of(
			winnerAndMaxClickerAndFirstClicker,
			middleRewardUsers
		);
	}

}
