package com.toudeuk.server.domain.game.repository;

import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
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

    private static final long MAX_CLICK = 5; // 12000

    @Resource(name = "redisTemplate")
    private ZSetOperations<String, Long> zSetOperations;

    @Resource(name = "redisTemplate")
    private ListOperations<String, Long> listOperations;

//
//    @Resource(name = "redisTemplate")
//    private ValueOperations<String, Integer> valueOperationsInt;

    @Autowired
    public RedisTemplate<String, Object> redisTemplate;


    public Integer getTotalClick() {
        Object o = redisTemplate.opsForValue().get(CLICK_KEY + "total");
        return o == null ? null : (Integer) o;
    }

    public Integer getUserClick(Long userId) {
        Object o = redisTemplate.opsForValue().get(CLICK_KEY + userId);
        return o == null ? null : (Integer) o;
    }

    public Integer getUserOrder(Long userId) {
        Long order = zSetOperations.reverseRank(CLICK_KEY + "order", userId);
        return order == null ? null : order.intValue();
    }

    public Long getPreviousOrderUser(int clickCount) {
        Set<Long> userIds = zSetOperations.reverseRange(CLICK_KEY + "order", 0, clickCount - 1);
        return userIds.isEmpty() ? null : userIds.iterator().next();
    }

    public Set<Long> getMaxClickUser() {
        return zSetOperations.reverseRange(CLICK_KEY + "order", 0, 0);
    }

    public Long getWinner() {
        Object o = redisTemplate.opsForList().index(CLICK_KEY + "log", -1);
        return o == null ? null : Long.parseLong(String.valueOf(o));
    }


    public List<Long> getLog() {
        Object o = redisTemplate.opsForList().range(CLICK_KEY + "log", 0, MAX_CLICK-1);
        return o == null ? null : (List<Long>) o;
    }

    public boolean isGameCoolTime() {
        return Boolean.TRUE.equals(redisTemplate.hasKey(COOLTIME_KEY + "game"));
    }

    public boolean isUserCoolTime(Long userId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(COOLTIME_KEY + userId));
    }


    public void setTotalClick() {
        redisTemplate.opsForValue().set(CLICK_KEY + "total", 0);
    }


    public void addTotalClick() {
        Long totalClick = redisTemplate.opsForValue().increment(CLICK_KEY + "total");
        if (totalClick == MAX_CLICK) {
            setGameCoolTime();
        }
    }

    public void addUserClick(Long userId) {
        zSetOperations.incrementScore(CLICK_KEY + "order", userId, 1);
    }

    public void addLog(Long userId) {
        redisTemplate.opsForList().rightPush(CLICK_KEY + "log", userId);
    }

    public void setGameCoolTime() {
        redisTemplate.opsForValue().set(COOLTIME_KEY + "game", "true", Duration.ofMinutes(1));
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
