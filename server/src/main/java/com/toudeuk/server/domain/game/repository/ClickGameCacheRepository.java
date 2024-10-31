package com.toudeuk.server.domain.game.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Repository;

import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClickGameCacheRepository {

	private static final String CLICK_KEY = "click:";
	private static final String GAME_KEY = "game:";

	private static final long MAX_CLICK = 5; // 12000
	private static final long COOLTIME_MINUTES = 1; // 5분

	@Resource(name = "longRedisTemplate")
	private ZSetOperations<String, Long> zSetOperations;

	@Resource(name = "longRedisTemplate")
	private ListOperations<String, Long> listOperations;

	@Resource(name = "longRedisTemplate")
	private ValueOperations<String, Long> valueOperationsLong;

	@Resource(name = "integerRedisTemplate")
	private ValueOperations<String, Integer> valueOperationsInt;

	@Autowired
	public RedisTemplate<String, Object> redisTemplate;

	// 게임 정보 game
	public void setGameId(Long gameId) {
		valueOperationsLong.set(GAME_KEY + "id", gameId);
	}

	public Long getGameId() {
		return valueOperationsLong.get(GAME_KEY + "id");
	}

	public void setGameCoolTime() {
		LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(COOLTIME_MINUTES);
		redisTemplate.opsForValue().set(GAME_KEY + "cooltime", expiredAt.toString(), Duration.ofMinutes(COOLTIME_MINUTES));
	}

	public boolean isGameCoolTime() {
		return Boolean.TRUE.equals(redisTemplate.hasKey(GAME_KEY + "cooltime"));
	}


	// 총 클릭수 click:total
	public void setTotalClick() {
		valueOperationsInt.set(CLICK_KEY + "total", 0);
	}

	public void addTotalClick() {
		Long totalClick = valueOperationsInt.increment(CLICK_KEY + "total");
		if (totalClick == MAX_CLICK) {
			setGameCoolTime();
		}
	}

	public Integer getTotalClick() {
		return valueOperationsInt.get(CLICK_KEY + "total");
	}


	// 클릭 수 click:count
	public void addUserClick(Long userId) {
		zSetOperations.incrementScore(CLICK_KEY + "count", userId, 1);
	}

	public Integer getUserClickCount(Long userId) { // 유저의 클릭 수
		Double clickCount = zSetOperations.score(CLICK_KEY + "count:", userId);
		return clickCount == null ? 0 : clickCount.intValue();
	}

	public Integer getUserClickCountRank(Long userId) { // 유저의 클릭 랭킹
		Long count = zSetOperations.reverseRank(CLICK_KEY + "count", userId);
		return count == null ? null : count.intValue();
	}

	public Long getPreviousClickCountUserId(int clickCount) { // 클릭수 기준 앞 등수 유저 아이디
		Set<Long> longSet = zSetOperations.rangeByScore(CLICK_KEY + "count", clickCount + 1, Integer.MAX_VALUE, 0, 1);
		return longSet.isEmpty() ? null : longSet.iterator().next();
	}

	public Long getMaxClickUserId() { // 가장 많이 누른 유저 아이디
		Set<Long> longSet = zSetOperations.reverseRange(CLICK_KEY + "count", 0, 0);
		return longSet.isEmpty() ? null : longSet.iterator().next();
	}


	// 클릭 순서 click:log
	public void addLog(Long userId) {
		listOperations.rightPush(CLICK_KEY + "log", userId);
	}

	public Long getWinner() {
		return listOperations.index(CLICK_KEY + "log", MAX_CLICK - 1);
	}

	public List<Long> getLog() {
		return listOperations.range(CLICK_KEY + "log", 0, MAX_CLICK - 1);
	}


	// 삭제
	public void deleteAllClickInfo() {
		redisTemplate.delete(CLICK_KEY + "total");
		redisTemplate.delete(CLICK_KEY + "count");
		redisTemplate.delete(CLICK_KEY + "log");
		redisTemplate.delete(GAME_KEY + "id");
	}
}
