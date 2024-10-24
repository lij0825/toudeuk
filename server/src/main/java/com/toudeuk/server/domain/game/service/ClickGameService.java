package com.toudeuk.server.domain.game.service;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;
import com.toudeuk.server.domain.game.repository.*;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import com.toudeuk.server.domain.user.repository.UserRepository;
import com.toudeuk.server.domain.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static com.toudeuk.server.core.exception.ErrorCode.ClickGame_NOT_FOUND;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

@Service
@RequiredArgsConstructor
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
        ClickGame clickGame = findById(gameId);

        // 저장 하기
        AtomicInteger order = new AtomicInteger(1);
        for (Object userId : clickLogs) {
            User user = userService.findById((Long) userId);

            ClickGameLog clickGameLog = ClickGameLog.create(user, order.getAndIncrement(), clickGame);
            clickGameLogRepository.save(clickGameLog);

            if (order.get() == 12000) {
                int count = clickCacheRepository.getUserClick((Long) userId);
                ClickGameRewardLog rewardLog = ClickGameRewardLog.create(user, clickGame, 10000, count, WINNER);
                continue;
            }
            if (order.get() % 1000 == 0) {
                int count = clickCacheRepository.getUserClick((Long) userId);

                ClickGameRewardLog rewardLog = ClickGameRewardLog.create(user, clickGame, 100, count, SECTION);
                clickGameRewardLogRepository.save(rewardLog);
            }
        }

        Long maxClickerId = clickCacheRepository.getMaxClicker();
        int maxCount = clickCacheRepository.getUserClick((Long) maxClickerId);
        User MaxClicker = userService.findById(maxClickerId);
        ClickGameRewardLog rewardLog = ClickGameRewardLog.create(MaxClicker, clickGame, 10000, maxCount, MAX_CLICKER);

        // Redis의 클릭 정보를 삭제
        clickCacheRepository.deleteAllClickInfo();
    }


    public void clickButton(Long userId) {
        clickCacheRepository.addUserClick(userId);

        User user = userService.findById(userId);
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




}
