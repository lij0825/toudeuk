package com.toudeuk.server.domain.game.repository;


import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

import java.util.Set;

@Repository
@RequiredArgsConstructor
public class ClickCacheRepository {

    private static final String Click_KEY = "click:";
    private final RedisTemplate<String, Object> redisTemplate;

    // 총 클릭
    public void addTotalClick() {
        redisTemplate.opsForValue().setIfAbsent(Click_KEY + "total", 0);
        redisTemplate.opsForValue().increment(Click_KEY + "total");
    }

    // 유저 클릭
    public void addUserClick(Long userId) {
        addTotalClick(); // 유적 클릭시 총 클릭도 증가한다.
        redisTemplate.opsForZSet().addIfAbsent(Click_KEY + "order", userId, 0);
        redisTemplate.opsForZSet().incrementScore(Click_KEY + "order", userId, 1);
    }

    public Integer getUserClick(Long userId) {
        Double clickCount = redisTemplate.opsForZSet().score(Click_KEY + "order", userId);
        return clickCount == null ? 0 : clickCount.intValue();
    }

    public Integer getTotalClick() {
        return (Integer) redisTemplate.opsForValue().get(Click_KEY + "total");
    }

    // 순위
    public Integer getUserOrder(Long userId) {
        Long order = redisTemplate.opsForZSet().reverseRank(Click_KEY + "order", userId);
        return order == null ? null : order.intValue();
    }

    public Set<Object> getPreviousOrderUser(Long userId){
        Integer clickCount = getUserClick(userId);
        return redisTemplate.opsForZSet().rangeByScore(Click_KEY + "order", clickCount + 1, Integer.MAX_VALUE, 0, 1);
    }

}