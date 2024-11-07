package com.toudeuk.server.domain.game.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.domain.game.dto.RankData;
import com.toudeuk.server.domain.game.kafka.dto.ClickDto;
import com.toudeuk.server.domain.game.kafka.dto.KafkaData;
import com.toudeuk.server.domain.user.entity.CashLog;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import com.toudeuk.server.domain.user.repository.CashLogRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
import com.toudeuk.server.domain.game.kafka.ClickProducer;
import com.toudeuk.server.domain.game.kafka.dto.ClickDto;
import com.toudeuk.server.domain.game.repository.ClickGameCacheRepository;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRewardLogRepository;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import com.toudeuk.server.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClickGameService {

    private static final int CLICK_CASH = -1;
    private static final int FIRST_CLICK = 500;

    private final ClickGameCacheRepository clickCacheRepository;
    private final ClickGameRepository clickGameRepository;
    private final UserRepository userRepository;
    private final ClickGameLogRepository clickGameLogRepository;
    private final ClickGameRewardLogRepository clickGameRewardLogRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final ClickProducer clickProducer;

    private final SimpMessagingTemplate messagingTemplate;
    private final CashLogRepository cashLogRepository;
    private final ClickGameCacheRepository clickGameCacheRepository;

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
                    0L,
                    "RUNNING",
                    totalClick
            );

            GameData.DisplayInfoForClicker displayInfoForClicker = GameData.DisplayInfoForClicker.of(
                    0L,
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



            log.info("======================================쿨타임없고, 게임도없으면 실행======================================");
            return;
        }
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

    @Transactional
    public void click(Long userId) throws JsonProcessingException {


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



            log.info("======================================쿨타임이면 실행======================================");
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
        clickCacheRepository.spendCash(userId);

        Integer userClickCount = clickCacheRepository.addUserClick(userId);
        Long totalClickCount = clickCacheRepository.addTotalClick();

        ClickDto clickDto = new ClickDto(
                userId,
                clickCacheRepository.getGameId(),
                CLICK_CASH,
                result,
                "클릭 게임" + clickCacheRepository.getGameId(),
                CashLogType.GAME,
                totalClickCount.intValue()
                );

        clickProducer.occurClickUserId(clickDto);

        GameData.DisplayInfoForEvery displayInfoForEvery = GameData.DisplayInfoForEvery.of(
                0L,
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

    // 로그, 캐시 데이터베이스 저장
//    public void saveData(KafkaData.ClickDto clickDto) {
//        User user = userRepository.findById(clickDto.getUserId())
//                .orElseThrow(() -> new BaseException(USER_NOT_FOUND));
//        user.updateCash(clickDto.getResultCash());
//
//        Long gameId = clickDto.getGameId();
//
//        clickGameLogRepository.save(ClickGameLog.create(user, clickDto.getChangeCash(), clickGameRepository.findById(gameId).orElseThrow(() -> new BaseException(GAME_NOT_FOUND)));
//
//    }


    public void asyncClick(Long userId) throws JsonProcessingException {
        log.info("카프카 클릭 asyncClick userId : {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(USER_NOT_FOUND));

        Integer userCash = clickCacheRepository.getUserCash(userId);
        int resultCash = userCash + CLICK_CASH;

        if (resultCash < 0) {
            throw new BaseException(NOT_ENOUGH_CASH);
        }
//        clickProducer.occurClickUserId(userId);
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
                myRank.intValue() + 1,
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

    @Transactional
    public void saveCashLogInGame(Long gameId) {
        ClickGame clickGame = clickGameRepository.findById(gameId)
                .orElseThrow(() -> new BaseException(GAME_NOT_FOUND));
        String gameName = "클릭 게임" + clickGame.getRound() + "회차";

        Set<ZSetOperations.TypedTuple<Long>> rankSet = clickCacheRepository.getRankingList();
        for (ZSetOperations.TypedTuple<Long> ranking : rankSet) {
            Long userId = ranking.getValue();
            User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
            Integer userCash = clickCacheRepository.getUserCash(userId);
            int changeCash = -ranking.getScore().intValue();
            int resultCash = userCash + changeCash;
            clickCacheRepository.updateUserCash(userId, changeCash);
            applicationEventPublisher.publishEvent(
                    new CashLogEvent(user, changeCash, resultCash, gameName, CashLogType.GAME));
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

    public RankData.Result getRankingList() {
        Set<ZSetOperations.TypedTuple<Long>> rankSet = clickCacheRepository.getRankingList();

        Long gameId = clickCacheRepository.getGameId();

        List<RankData.RankList> rankList = new ArrayList<>();
        int rank = 1;
        for (ZSetOperations.TypedTuple<Long> ranking : rankSet) {
            Long userId = ranking.getValue();
            User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
            rankList.add(RankData.RankList.of(rank, user.getNickname(), user.getProfileImg(), ranking.getScore().intValue()));
            rank++;
        }
        RankData.Result result = RankData.Result.of(gameId, rankList);
        return result;

    }


    @Transactional
    public void saveGameData(ClickDto clickDto) {
        Long userId = clickDto.getUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));

        ClickGame clickGame = clickGameRepository.findById(clickDto.getGameId()).orElseThrow(() -> new BaseException(GAME_NOT_FOUND));
        Integer totalClickCount = clickDto.getTotalClickCount();
        int changeCash = clickDto.getChangeCash();
        int resultCash = clickDto.getResultCash();
        String cashName = clickDto.getCashName();
        CashLogType cashLogType = clickDto.getCashLogType();


        CashLog cashLog = CashLog.create(user, changeCash, resultCash, cashName, cashLogType);

        ClickGameLog clickGameLog = ClickGameLog.create(user, totalClickCount, clickGame);

        // 캐시 로그 저장
        cashLogRepository.save(cashLog);
        // 게임 로그 저장
        clickGameLogRepository.save(clickGameLog);

        // 첫번째 클릭자 보상 제공
        if(totalClickCount == 1){

            ClickGameRewardLog clickGameRewardLog = ClickGameRewardLog.create(user, clickGame, FIRST_CLICK, totalClickCount, SECTION);

            CashLog rewardCashLog = CashLog.create(user, FIRST_CLICK, resultCash + FIRST_CLICK, cashName, CashLogType.REWARD);

            clickCacheRepository.reward(userId, FIRST_CLICK);
            cashLogRepository.save(rewardCashLog);
            clickGameRewardLogRepository.save(clickGameRewardLog);
        }

        // 100단위 클릭자 보상 제공
        long rewardFlag = totalClickCount % 100;
        if(rewardFlag == 0){
            int reward = totalClickCount / 2;
            ClickGameRewardLog clickGameRewardLog;
            if(totalClickCount == 1000){
                clickGameRewardLog = ClickGameRewardLog.create(user, clickGame, reward, totalClickCount, WINNER);
            }
            else {
                clickGameRewardLog = ClickGameRewardLog.create(user, clickGame, reward, totalClickCount, SECTION);
            }

            CashLog rewardCashLog = CashLog.create(user, reward, resultCash + reward, cashName, CashLogType.REWARD);
            clickCacheRepository.reward(userId, reward);
            cashLogRepository.save(rewardCashLog);
            clickGameRewardLogRepository.save(clickGameRewardLog);
        }
    }
}
