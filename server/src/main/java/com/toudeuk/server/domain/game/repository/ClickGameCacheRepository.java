package com.toudeuk.server.domain.game.repository;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class ClickGameCacheRepository {

    private static final String CLICK_KEY = "click:";
    private static final String GAME_KEY = "game:";

    private final RedisTemplate<String, Long> redisTemplate;

    // 총 클릭
    public void initTotalClick() {
        redisTemplate.opsForValue().set(CLICK_KEY + "total", 0L);
    }

    public int getTotalClick() {
        Long totalClick = redisTemplate.opsForValue().get(CLICK_KEY + "total");
        return totalClick == null ? 0 : totalClick.intValue();
    }

    // 유저 클릭
    public String addUserClick(Long userId) {
        // 게임 쿨타임
        if (isGameInCooltime()) {
            return "GAME_COOLTIME";
        }

        // 유저 쿨타임
        Long userCooltime = redisTemplate.opsForValue().get(CLICK_KEY + "cooltime:" + userId);
        if (userCooltime != null && userCooltime == 1L) {
            return "USER_COOLTIME";
        }

        redisTemplate.opsForValue().increment(CLICK_KEY + "total");
        int totalClick = getTotalClick();
        if (totalClick == 12000) {
            setGameCooltime();
        }

        redisTemplate.opsForZSet().incrementScore(CLICK_KEY + "order", userId, 1);
        saveClickLog(userId);

        // 유저 쿨타임 시작
        redisTemplate.opsForValue().set(CLICK_KEY + "cooltime:" + userId, 1L);
        redisTemplate.expire(CLICK_KEY + "cooltime:" + userId, 500, TimeUnit.MILLISECONDS);

        return "SUCCESS";
    }

    // 유저 클릭수
    public int getUserClick(Long userId) {
        Double userClick = redisTemplate.opsForZSet().score(CLICK_KEY + "order", userId);
        return userClick == null ? 0 : userClick.intValue();
    }

    // 맥시클릭커
    public Long getMaxClicker() {
        Set<Long> result = redisTemplate.opsForZSet().reverseRangeByScore(CLICK_KEY + "order", Integer.MAX_VALUE, -1, 0, 1);

        return result.isEmpty() ? null : result.iterator().next();
    }

    // 유저 순위
    public Long getUserOrder(Long userId) {
        Long order = redisTemplate.opsForZSet().reverseRank(CLICK_KEY + "order", userId);
        return order == null ? null : order;
    }

    // 내 앞순위 유저
    public Long getPreviousOrderUser(Long userId) {
        int clickCount = getUserClick(userId);
        Set<Long> result = redisTemplate.opsForZSet().rangeByScore(CLICK_KEY + "order", clickCount + 1, Integer.MAX_VALUE, 0, 1);
        return result == null ? null : result.iterator().next();
    }

    // 클릭 로그 저장
    public void saveClickLog(Long userId) {
        redisTemplate.opsForList().rightPush(CLICK_KEY + "log", userId);
    }

    public List<Long> getClickLog() {
        return redisTemplate.opsForList().range(CLICK_KEY + "log", 0, 12000);
    }

    // 게임 회차 설정
    public void setGameId(Long gameId) {
        redisTemplate.opsForValue().set(GAME_KEY + "id", gameId);
    }

    public Long getGameId() {
        return (Long) redisTemplate.opsForValue().get(GAME_KEY + "id");
    }

    // 게임 쿨타임 설정
    public void setGameCooltime() {
        redisTemplate.opsForValue().set(GAME_KEY + "cooltime", 1L);
        redisTemplate.expire(GAME_KEY + "cooltime", 5, TimeUnit.MINUTES);
    }

    public boolean isGameInCooltime() {
        Long cooltime = redisTemplate.opsForValue().get(GAME_KEY + "cooltime");
        return cooltime != null && cooltime == 1L;
    }


    // 삭제
    public void deleteAllClickInfo() {
        redisTemplate.delete(CLICK_KEY + "total");
        redisTemplate.delete(CLICK_KEY + "order");
        redisTemplate.delete(CLICK_KEY + "log");
    }
}
