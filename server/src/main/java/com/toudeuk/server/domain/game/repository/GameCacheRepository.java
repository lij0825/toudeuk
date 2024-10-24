package com.toudeuk.server.domain.game.repository;

import com.toudeuk.server.domain.game.service.ClickGameService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import lombok.RequiredArgsConstructor;

import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class GameCacheRepository {

    private static final String GAME_KEY = "game:";
    private final RedisTemplate<String, Object> redisTemplate;
    private final ClickCacheRepository clickCacheRepository;
    private final ClickGameService clickGameService;

    // 게임 회차
    public void setGameId(Long gameId) {
        redisTemplate.opsForValue().set(GAME_KEY + "id", gameId);
    }
    public Long getGameId() {
        return (Long) redisTemplate.opsForValue().get(GAME_KEY + "id");
    }

    // 게임 쿨타임
    public void setGameCooltime() {
        redisTemplate.opsForValue().set(GAME_KEY + "cooltime", true);
        redisTemplate.expire(GAME_KEY + "cooltime", 5, TimeUnit.MINUTES);

        clickGameService.saveClickGame();
    }

    public boolean isGameInCooltime() {
        Boolean cooltime = (Boolean) redisTemplate.opsForValue().get(GAME_KEY + "cooltime");
        return Boolean.TRUE.equals(cooltime);
    }

    // 게임 쿨타임 끝나기 까지 (이걸 쓸 일이 있으려나?)
    public Long getRemainingCooltime() {
        return redisTemplate.getExpire(GAME_KEY + "cooltime", TimeUnit.SECONDS);
    }
}
