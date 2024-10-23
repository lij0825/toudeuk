package com.toudeuk.server.domain.game.service;

import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.game.repository.ClickCacheRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.game.repository.GameCacheRepository;
import com.toudeuk.server.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClickGameService {

    private final ClickCacheRepository clickCacheRepository;
    private final GameCacheRepository gameCacheRepository;
    private final ClickGameRepository clickGameRepository;

    @Transactional
    public void saveClickGame(Long ClickGameId) {
        // Redis에서 총 클릭 수와 로그 가져오기
        Integer totalClick = clickCacheRepository.getTotalClick();
        List<Object> clickLogs = clickCacheRepository.getClickLog();

        // 저장 하기


        // Redis의 클릭 정보를 삭제
        clickCacheRepository.deleteAllClickInfo();
    }
}
