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
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ClickGameCacheRepository {

	private static final String CLICK_TOTAL_KEY = "click:total";
	private static final String CLICK_COUNT_KEY = "click:count";
	private static final String CLICK_LOG_KEY = "click:log";
	private static final String GAME_ID_KEY = "game:id";
	private static final String GAME_COOLTIME_KEY = "game:cooltime";

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
		valueOperationsLong.set(GAME_ID_KEY, gameId);
	}

	public boolean existGame() {
		return valueOperationsLong.get(GAME_ID_KEY) != null;
	}

	public boolean waitingGameStart() {
		return valueOperationsLong.get(GAME_ID_KEY) == null;
	}

	public Long getGameId() {
		return valueOperationsLong.get(GAME_ID_KEY);
	}

	public void setGameCoolTime() {
		log.info("setGameCoolTime");
		LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(COOLTIME_MINUTES);
		redisTemplate.opsForValue().set(GAME_COOLTIME_KEY, expiredAt.toString(), Duration.ofMinutes(COOLTIME_MINUTES));
	}

	public boolean isGameCoolTime() {
		return Boolean.TRUE.equals(redisTemplate.hasKey(GAME_COOLTIME_KEY));
	}

	public Long getGameCoolTime() {
		return valueOperationsLong.get(GAME_COOLTIME_KEY);
	}

	// 총 클릭수 click:total
	public Integer setTotalClick() {
		valueOperationsInt.set(CLICK_TOTAL_KEY, 0);
		return 0;
	}

	public Long addTotalClick() {
		Long totalClick = valueOperationsInt.increment(CLICK_TOTAL_KEY);

		if (totalClick == null) {
			totalClick = getTotalClick().longValue();
			log.info("totalClick : {}", totalClick);
		}

		log.info("totalClick : {}", totalClick);
		if (totalClick == MAX_CLICK) {
			setGameCoolTime();
		}
		return totalClick;
	}

	public Integer getTotalClick() {
		return valueOperationsInt.get(CLICK_TOTAL_KEY);
	}

	// 클릭 수 click:count
	public Integer addUserClick(Long userId) {
		Double score = zSetOperations.incrementScore(CLICK_COUNT_KEY, userId, 1);
		return score == null ? 1 : score.intValue();
	}

	public Integer getUserClickCount(Long userId) { // 유저의 클릭 수
		Double clickCount = zSetOperations.score(CLICK_COUNT_KEY, userId);
		log.info("clickCount : {}", zSetOperations.score(CLICK_COUNT_KEY, userId));
		return clickCount == null ? 0 : clickCount.intValue();
	}

	public Long getUserRank(Long userId) { // 유저의 클릭 랭킹
		Long rank = zSetOperations.reverseRank(CLICK_COUNT_KEY, userId);
		return rank == null ? -1 : rank;
	}

	public Long getPrevUserId(int clickCount) { // 클릭수 기준 앞 등수 유저 아이디
		Set<Long> longSet = zSetOperations.rangeByScore(CLICK_COUNT_KEY, clickCount + 1, Integer.MAX_VALUE, 0, 1);
		return longSet.isEmpty() ? null : longSet.iterator().next();
	}

	public Long getMaxClickUserId() { // 가장 많이 누른 유저 아이디
		Set<Long> longSet = zSetOperations.reverseRange(CLICK_COUNT_KEY, 0, 0);
		return longSet.isEmpty() ? null : longSet.iterator().next();
	}

	public Set<ZSetOperations.TypedTuple<Long>> getRankingList() {
		return zSetOperations.reverseRangeByScoreWithScores(CLICK_COUNT_KEY, 0, Integer.MAX_VALUE);
	}

	// 클릭 순서 click:log
	public void addLog(Long userId) {
		listOperations.rightPush(CLICK_LOG_KEY, userId);
	}

	public Long getWinner() {
		return listOperations.index(CLICK_LOG_KEY, MAX_CLICK - 1);
	}

	public List<Long> getLog() {
		return listOperations.range(CLICK_LOG_KEY, 0, MAX_CLICK - 1);
	}

	// 삭제
	public void deleteAllClickInfo() {
		redisTemplate.delete(CLICK_TOTAL_KEY);
		redisTemplate.delete(CLICK_COUNT_KEY);
		redisTemplate.delete(CLICK_LOG_KEY);
		redisTemplate.delete(GAME_ID_KEY);
	}
}
