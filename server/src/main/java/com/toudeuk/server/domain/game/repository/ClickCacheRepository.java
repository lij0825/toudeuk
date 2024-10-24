package com.toudeuk.server.domain.game.repository;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClickCacheRepository {

	private static final String Click_KEY = "click:";
	private final RedisTemplate<String, Object> redisTemplate;
	private final GameCacheRepository gameCacheRepository;

	// 총 클릭
	public void initTotalClick() {
		redisTemplate.opsForValue().set(Click_KEY + "total", 0);
	}

	public Integer getTotalClick() {
		Object totalClick = redisTemplate.opsForValue().get(Click_KEY + "total");
		return totalClick == null ? 0 : (Integer)totalClick;
	}

	// 유저 클릭
	public String addUserClick(Long userId) {
		// 게임 쿨타임
		if (gameCacheRepository.isGameInCooltime()) {
			return "GAME_COOLTIME";
		}

		// 유저 쿨타임
		if (Boolean.TRUE.equals(redisTemplate.opsForValue().get(Click_KEY + "cooltime:" + userId))) {
			return "USER_COOLTIME";
		}

		Integer totalClick = redisTemplate.opsForValue()
			.increment(Click_KEY + "total")
			.intValue(); // 유저 클릭시 총 클릭도 증가한다.
		// 12000 클릭시 게임 쿨타임 시작
		if (totalClick == 12000) {
			gameCacheRepository.setGameCooltime();
		}
		redisTemplate.opsForZSet().incrementScore(Click_KEY + "order", userId, 1);
		saveClickLog(userId);

		// 유저 쿨타임 시작
		redisTemplate.opsForValue().set(Click_KEY + "cooltime:" + userId, true);
		redisTemplate.expire(Click_KEY + "cooltime:" + userId, 500, TimeUnit.MILLISECONDS); //

		return "SUCCESS"; // 정상 처리
	}

	// 유저 클릭수
	public Integer getUserClick(Long userId) {
		Double userClick = redisTemplate.opsForZSet().score(Click_KEY + "order", userId);
		return userClick == null ? 0 : userClick.intValue();
	}

	// 맥시클릭커
	public Long getMaxClicker() {
		Set<Object> result = redisTemplate.opsForZSet()
			.reverseRangeByScore(Click_KEY + "order", Integer.MAX_VALUE, -1, 0, 1);
		return result == null ? null : (Long)result.toArray()[0];
	}

	// 유저 순위
	public Integer getUserOrder(Long userId) {
		Long order = redisTemplate.opsForZSet().reverseRank(Click_KEY + "order", userId);
		return order == null ? null : order.intValue();
	}

	// 내 앞순위 유저
	public Long getPreviousOrderUser(Long userId) {
		Integer clickCount = getUserClick(userId);
		Set<Object> result = redisTemplate.opsForZSet()
			.rangeByScore(Click_KEY + "order", clickCount + 1, Integer.MAX_VALUE, 0, 1);
		return result == null ? null : (Long)result.toArray()[0];
	}

	// 로그
	public void saveClickLog(Long userId) {
		redisTemplate.opsForList().rightPush(Click_KEY + "log", userId);
	}

	public List<Object> getClickLog() {
		return redisTemplate.opsForList().range(Click_KEY + "log", 0, 12000);
	}

	// 삭제
	public void deleteAllClickInfo() {
		redisTemplate.delete(Click_KEY + "total");
		redisTemplate.delete(Click_KEY + "order");
		redisTemplate.delete(Click_KEY + "log");
	}

}