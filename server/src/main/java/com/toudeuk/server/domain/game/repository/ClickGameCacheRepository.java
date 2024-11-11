package com.toudeuk.server.domain.game.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.domain.game.dto.RankData;
import com.toudeuk.server.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.*;
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
	private static final String NICKNAME_KEY = "user:id:";

	private static final String USER_CASH_KEY = "cash:";

	private static final long MAX_CLICK = 1000; // 12000
	private static final long COOLTIME_MINUTES = 1; // 5분

	@Resource(name = "redisTemplate")
	private ZSetOperations<String, Object> zSetOperations;
	@Resource(name = "redisTemplate")
	private ListOperations<String, Object> listOperations;
	@Resource(name = "redisTemplate")
	public ValueOperations<String, Object> valueOperations;

	@Autowired
	public RedisTemplate<String, String> redisTemplate;

	@Autowired
	private UserRepository userRepository;

	// 게임 정보 game
	public void setGameId(Long gameId) {
		valueOperations.set(GAME_ID_KEY, gameId);
	}

	public boolean existGame() {
		return valueOperations.get(GAME_ID_KEY) != null;
	}


	public Long getGameId() {
		return ((Number)valueOperations.get(GAME_ID_KEY)).longValue();
	}

	public void setGameCoolTime() {
		log.info("setGameCoolTime");
		LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(COOLTIME_MINUTES);
		valueOperations.set(GAME_COOLTIME_KEY, expiredAt.toString(), Duration.ofMinutes(COOLTIME_MINUTES));
	}

	public boolean isGameCoolTime() {
		return Boolean.TRUE.equals(redisTemplate.hasKey(GAME_COOLTIME_KEY));
	}

	public LocalDateTime getGameCoolTime() {
		log.info("valueOperations.get(GAME_COOLTIME_KEY) : " + valueOperations.get(GAME_COOLTIME_KEY));

		return LocalDateTime.parse((String)valueOperations.get(GAME_COOLTIME_KEY));
	}

	// 총 클릭수 click:total
	public Integer setTotalClick() {
		valueOperations.set(CLICK_TOTAL_KEY, 0);
		return 0;
	}

	public Integer addTotalClick() {
		Long totalClick = ((Number)valueOperations.increment(CLICK_TOTAL_KEY)).longValue();

		log.info("totalClick : {}", totalClick);
		if (totalClick.equals(MAX_CLICK)) {
			setGameCoolTime();
		}
		return totalClick.intValue();
	}

	public Integer getTotalClick() {
		return ((Number)valueOperations.get(CLICK_TOTAL_KEY)).intValue();
	}

	// 클릭 수 click:count
	public Integer addUserClick(Long userId) {
		Number score = zSetOperations.incrementScore(CLICK_COUNT_KEY, userId, 1);
		log.info("score : {}", score);

		return score == null ? 1 : score.intValue();
	}

	public Integer getUserClickCount(Long userId) { // 유저의 클릭 수
		Number clickCount = zSetOperations.score(CLICK_COUNT_KEY, userId);
		log.info("clickCount : {}", zSetOperations.score(CLICK_COUNT_KEY, userId));
		return clickCount == null ? 0 : clickCount.intValue();
	}

	public Integer getUserRank(Long userId) { // 유저의 클릭 랭킹
		Long rank = zSetOperations.reverseRank(CLICK_COUNT_KEY, userId);
		if(rank == null){
			return -1;
		}
		return rank.intValue() + 1;
	}

	public Long getPrevUserId(int clickCount) { // 클릭수 기준 앞 등수 유저 아이디

		Set<Long> longSet = zSetOperations.rangeByScore(CLICK_COUNT_KEY, clickCount + 1, Integer.MAX_VALUE, 0, 1)
			.stream()
			.map(item -> ((Number) item).longValue())
			.collect(Collectors.toSet());

		return longSet.isEmpty() ? null : longSet.iterator().next();
	}

	public Long getMaxClickUserId() { // 가장 많이 누른 유저 아이디
		Set<Long> longSet = zSetOperations.reverseRange(CLICK_COUNT_KEY, 0, 0)
			.stream()
			.map(item -> ((Number) item).longValue())
			.collect(Collectors.toSet());

		return longSet.isEmpty() ? null : longSet.iterator().next();
	}

	public List<RankData.UserScore> getRankingList() {
		return zSetOperations.reverseRangeByScoreWithScores(CLICK_COUNT_KEY, 0, Integer.MAX_VALUE, 0, 10)
			.stream()
			.map(tuple -> RankData.UserScore.of(
                    String.valueOf(userRepository.findById(Long.parseLong(tuple.getValue().toString())).orElseThrow(
									() -> new BaseException(ErrorCode.USER_NOT_FOUND)).getNickname()), tuple.getScore().longValue()))
			.toList();
	}

	// 클릭 순서 click:log
	public void addLog(Long userId) {
		listOperations.rightPush(CLICK_LOG_KEY, userId);
	}

	public Long getWinner() {
		return ((Number)listOperations.index(CLICK_LOG_KEY, MAX_CLICK - 1)).longValue();
	}

	public List<Long> getLog() {
		List<Object> logs = listOperations.range(CLICK_LOG_KEY, 0, MAX_CLICK - 1);

		return logs.stream().map(
			item -> ((Number)item).longValue()
		).toList();
	}

	// 삭제
	public void deleteAllClickInfo() {
		redisTemplate.delete(CLICK_TOTAL_KEY);
		log.info("redisTemplate.delete(CLICK_TOTAL_KEY);");

		redisTemplate.delete(CLICK_COUNT_KEY);
		log.info("redisTemplate.delete(CLICK_COUNT_KEY);");

		redisTemplate.delete(CLICK_LOG_KEY);
		log.info("redisTemplate.delete(CLICK_LOG_KEY);");

		redisTemplate.delete(GAME_ID_KEY);
		log.info("redisTemplate.delete(GAME_ID_KEY);");
	}

	// 캐시 cash
	public Integer getUserCash(Long userId) {


		Integer userCash = (Integer) valueOperations.get(USER_CASH_KEY + userId);

		if (userCash == null) {
			Integer cash = userRepository.findById(userId).get().getCash();
			valueOperations.set(USER_CASH_KEY + userId, cash);
			return cash;
		}

		return userCash;
	}

	public void updateUserCash(Long userId, long changeCash) {
		valueOperations.increment(USER_CASH_KEY + userId, changeCash);
	}


	// 실시간 보상 제공
	public void reward(Long userId, int reward) {
		valueOperations.increment(USER_CASH_KEY + userId, reward);
	}

	public void setUsername(Long userId, String nickname) {
		redisTemplate.opsForValue().set(NICKNAME_KEY + userId.toString(), nickname);
	}

	public String getUsername(Long userId) {
		return redisTemplate.opsForValue().get(NICKNAME_KEY + userId.toString());
	}
}
