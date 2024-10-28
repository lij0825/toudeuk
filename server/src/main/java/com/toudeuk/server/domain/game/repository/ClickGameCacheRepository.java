package com.toudeuk.server.domain.game.repository;

import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Repository;
import lombok.RequiredArgsConstructor;

import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class ClickGameCacheRepository {

    private static final String CLICK_KEY = "click:";
    private static final String GAME_KEY = "game:";
    private static final String COOLTIME_KEY = "cooltime:";


    @Resource(name = "redisTemplate")
    private ZSetOperations<String, Long> zSetOperations;

    @Resource(name = "redisTemplate")
    private ListOperations<String, Long> listOperations;

    @Resource(name = "redisTemplate")
    private ValueOperations<String, Long> valueOperationsLong;

    @Resource(name = "redisTemplate")
    private ValueOperations<String, Integer> valueOperationsInt;

    public RedisTemplate<String, String> redisTemplate;


    public Integer getTotalClick() {
        return valueOperationsInt.get(CLICK_KEY + "total");
    }

    public Integer getUserClick(Long userId) {
        Integer clickCount = valueOperationsInt.get(CLICK_KEY + userId);
        return clickCount == null ? 0 : clickCount;
    }

    public Integer getUserOrder(Long userId) {
        Long order = zSetOperations.reverseRank(CLICK_KEY + "order", userId);
        return order == null ? null : order.intValue();
    }

    public Set<Long> getPreviousOrderUser(int clickCount) {
        return zSetOperations.rangeByScore(CLICK_KEY + "order", clickCount + 1, Integer.MAX_VALUE, 0, 1);
    }

    public Set<Long> getMaxClickUser() {
        return zSetOperations.reverseRange(CLICK_KEY + "order", 0, 0);
    }

    public Long getWinner() {
        return listOperations.index(CLICK_KEY + "log", 12000-1);
    }


    public List<Long> getLog() {
        return listOperations.range(CLICK_KEY + "log", 0, 12000-1);
    }

    public boolean isGameCoolTime() {
        return Boolean.TRUE.equals(redisTemplate.hasKey(COOLTIME_KEY + "game"));
    }

    public boolean isUserCoolTime(Long userId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(COOLTIME_KEY + userId));
    }


    public void setTotalClick() {
        valueOperationsInt.set(CLICK_KEY + "total", 0);
    }


    public void addTotalClick() {
        valueOperationsInt.increment(CLICK_KEY + "total");
    }

    public void addUserClick(Long userId) {
        zSetOperations.incrementScore(CLICK_KEY + "order", userId, 1);
    }
    public void addLog(Long userId) {
        listOperations.rightPush(CLICK_KEY + "log", userId);
    }

    public void setGameCoolTime() {
        redisTemplate.opsForValue().set(COOLTIME_KEY + "game", "true", Duration.ofMinutes(5));
    }

    public void setUserCoolTime(Long userId) {
        redisTemplate.opsForValue().set(COOLTIME_KEY + userId, "true", Duration.ofMillis(500));
    }


    // 삭제
    public void deleteAllClickInfo() {
        redisTemplate.delete(CLICK_KEY + "total");
        redisTemplate.delete(CLICK_KEY + "order");
        redisTemplate.delete(CLICK_KEY + "log");
    }
}
