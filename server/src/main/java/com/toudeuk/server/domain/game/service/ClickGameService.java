package com.toudeuk.server.domain.game.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.toudeuk.server.domain.item.entity.Item;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.UserItem;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
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
	private static final int MAX_CLICK = 5; // 12000

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
		if (clickCacheRepository.isUserCoolTime(userId) || clickCacheRepository.isGameCoolTime()) {
			throw new BaseException(COOL_TIME);
		}
		// * 클릭시 캐쉬 로직 추가 / 유저 조회 -> 캐쉬 업데이트 이렇게 2번 DB에 접근
		// * resultCash = 유저의 현재 캐쉬 - 클릭당 캐쉬
		// * 이건 너무 구려, 그니까 큐를 사용하자

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		int resultCash = user.getCash() + CLICK_CASH;
//		if (resultCash < 0) {
//			throw new BaseException(NOT_ENOUGH_CASH);
//		}

		user.updateCash(resultCash);

		// * 클릭 시 레디스 캐쉬 로직
		clickCacheRepository.addUserClick(userId);
		clickCacheRepository.addTotalClick();

		clickCacheRepository.addLog(userId);
		clickCacheRepository.setUserCoolTime(userId);

		if (clickCacheRepository.isGameCoolTime()) {
			log.info("게임 종료");
			saveLog(1L);
			saveReward(1L);
			clickCacheRepository.deleteAllClickInfo();
		}
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
		for (Object userId : clickLogs) {
			User user = userRepository.findById(Long.parseLong(String.valueOf(userId)))
				.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

			ClickGameLog clickGameLog = ClickGameLog.create(user, order++, clickGame);
			clickGameLogRepository.save(clickGameLog);
		}
	}

	@Transactional
	public void saveReward(Long gameId) {
		ClickGame clickGame = clickGameRepository.findById(gameId)
			.orElseThrow(() -> new BaseException(GAME_NOT_FOUND));

		Long maxClickUserId = getMaxClickUser();
		Long winnerId = getWinner();

        // FIXME : 같은 레포지토리에 조회 쿼리를 두번 날리는 거 한번에 가져오게 수정하기, DB 왕복 줄이기

		// User maxClickUser = userRepository.findById(maxClickUserId)
		// 		.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		// User winner = userRepository.findById(winnerId)
		// 		.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		List<User> users = userRepository.findAllById(List.of(maxClickUserId, winnerId));

		System.out.println("kklasdfklashjdfklasujdhfgaklsdjfhaskldjh");
		System.out.println(users.stream());
		// * 예외 처리할거 더 있으면 추가하고
		if (users.size() < 2) {
			throw new BaseException(USER_NOT_FOUND);
		}

		Map<Long, User> userMap = users.stream()
			.collect(Collectors.toMap(User::getId,
				Function.identity())); // * Function.identity()은 입력을 그대로 반환하는 함수 User 넣으면 User 반환

		User maxClickUser = Optional.ofNullable(userMap.get(maxClickUserId))
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		log.info("maxClickUser", maxClickUser);

		User winner = Optional.ofNullable(userMap.get(winnerId))
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		log.info("winner", winner);
		int maxClickCount = getUserClick(maxClickUserId);

		int winnerClickCount = getUserClick(winnerId);



		ClickGameRewardLog maxClickReward = ClickGameRewardLog.create(maxClickUser, clickGame, 1000, maxClickCount, MAX_CLICKER);
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
		Long previousOrderUser = clickCacheRepository.getPreviousOrderUser(clickCount);
		if (previousOrderUser == null) {
			throw new BaseException(GAME_ERROR);
		}
		return previousOrderUser;
	}

	public Long getMaxClickUser() {
		Set<Long> maxClickUser = clickCacheRepository.getMaxClickUser();
		if (maxClickUser == null || maxClickUser.isEmpty()) {
			throw new BaseException(REWARD_USER_NOT_FOUND);
		}
		Object id = maxClickUser.iterator().next();
		return Long.parseLong(String.valueOf(id));
	}

	public Long getWinner() {
		Long winner = clickCacheRepository.getWinner();
		if (winner == null) {
			throw new BaseException(REWARD_USER_NOT_FOUND);
		}
		return winner;
	}

}
