package com.toudeuk.server.domain.game.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Repository;

import com.toudeuk.server.core.kafka.dto.KafkaGameCashLogDto;
import com.toudeuk.server.domain.game.dto.RankData;
import com.toudeuk.server.domain.user.repository.UserRepository;

import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ClickGameCacheRepository {

	private static final String CLICK_TOTAL_KEY = "click:total";
	private static final String CLICK_COUNT_KEY = "click:count";
	private static final String GAME_ID_KEY = "game:id";
	private static final String GAME_COOLTIME_KEY = "game:cooltime";
	private static final String NICKNAME_KEY = "nickname:";
	private static final String USER_CASH_KEY = "cash:";

	private static final String MIDDLE_REWARD_KEY = "middle_reward:";
	private static final String WINNER = "winner";
	private static final String MAX_CLICKER = "max_clicker";
	private static final String FIRST_CLICKER = "first_clicker";

	private static final long MAX_CLICK = 1000; // 12000
	// private static final long COOLTIME_MINUTES = 1; // 5분

	private static final long COOLTIME_SECOND = 20; // 20초

	@Resource(name = "redisTemplate")
	private ZSetOperations<String, Object> zSetOperations;
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
		LocalDateTime expiredAt = LocalDateTime.now().plusSeconds(COOLTIME_SECOND);
		valueOperations.set(GAME_COOLTIME_KEY, expiredAt.toString(), Duration.ofSeconds(COOLTIME_SECOND));
	}

	public boolean isGameCoolTime() {
		return Boolean.TRUE.equals(redisTemplate.hasKey(GAME_COOLTIME_KEY));
	}

	public LocalDateTime getGameCoolTime() {
		log.info("valueOperations.get(GAME_COOLTIME_KEY) : " + valueOperations.get(GAME_COOLTIME_KEY));

		return LocalDateTime.parse((String)Objects.requireNonNull(valueOperations.get(GAME_COOLTIME_KEY)));
	}

	// 총 클릭수 click:total
	public Integer setTotalClick() {
		valueOperations.set(CLICK_TOTAL_KEY, 0);
		return 0;
	}

	public Integer addTotalClick() {
		return ((Number)valueOperations.increment(CLICK_TOTAL_KEY)).intValue();
	}

	public Integer getTotalClick() {
		return ((Number)valueOperations.get(CLICK_TOTAL_KEY)).intValue();
	}

	// 클릭 수 click:count
	public Integer addUserClick(Long userId) {
		if (getUsername(userId) == null) {
			return -1;
		}
		Number score = zSetOperations.incrementScore(CLICK_COUNT_KEY, getUsername(userId), 1);
//		log.info("score : {}", score);

		return score == null ? 1 : score.intValue();
	}

	public Integer getUserClickCount(Long userId) { // 유저의 클릭 수
		Number clickCount = zSetOperations.score(CLICK_COUNT_KEY, getUsername(userId));
		log.info("clickCount : {}", zSetOperations.score(CLICK_COUNT_KEY, getUsername(userId)));
		return clickCount == null ? 0 : clickCount.intValue();
	}

	public Integer getUserRank(Long userId) { // 유저의 클릭 랭킹
		Long rank = zSetOperations.reverseRank(CLICK_COUNT_KEY, getUsername(userId));
		if (rank == null) {
			return -1;
		}
		return rank.intValue() + 1;
	}

	public List<RankData.UserScore> getRankingList() {
		return zSetOperations.reverseRangeByScoreWithScores(CLICK_COUNT_KEY, 0, Integer.MAX_VALUE, 0, 10)
			.stream()
			.map(tuple -> RankData.UserScore.of((String)tuple.getValue(), ((Number)tuple.getScore()).longValue()))
			.toList();
	}

	public List<String> getMaxClickerList(Long maxClick) {
		return zSetOperations.reverseRangeByScore(CLICK_COUNT_KEY, maxClick, maxClick)
			.stream()
			.map(Objects::toString)
			.toList();
	}

	// 삭제
	public void deleteAllClickInfo() {
		redisTemplate.delete(CLICK_TOTAL_KEY);
		log.info("redisTemplate.delete(CLICK_TOTAL_KEY);");

		redisTemplate.delete(CLICK_COUNT_KEY);
		log.info("redisTemplate.delete(CLICK_COUNT_KEY);");

		redisTemplate.delete(GAME_ID_KEY);
		log.info("redisTemplate.delete(GAME_ID_KEY);");

		deleteByPattern(NICKNAME_KEY + "*");
		log.info("redisTemplate.delete(NICKNAME_KEY);");
	}

	// 캐시 cash
	public Integer getUserCash(Long userId) {

		Integer userCash = (Integer)valueOperations.get(USER_CASH_KEY + userId);

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
		redisTemplate.opsForValue().set(NICKNAME_KEY + nickname, userId.toString());
	}

	public String getUsername(Long userId) {
		return redisTemplate.opsForValue().get(NICKNAME_KEY + userId.toString());
	}

	public void deleteRewardInfo(){
		redisTemplate.delete(WINNER);
		redisTemplate.delete(MAX_CLICKER);
		redisTemplate.delete(FIRST_CLICKER);
		deleteByPattern(MIDDLE_REWARD_KEY + "*");
	}

	public void addMiddleReward(Long userId, Long clickCount) {
		redisTemplate.opsForValue().set(MIDDLE_REWARD_KEY + clickCount, userId.toString());
	}

	public Map<Long, Long> getMiddleReward() {
		Set<String> keys = redisTemplate.keys(MIDDLE_REWARD_KEY + "*");

		return keys.stream()
			.collect(Collectors.toMap(
				key -> Long.parseLong(key.replace(MIDDLE_REWARD_KEY, "")),
				key -> {
					String value = redisTemplate.opsForValue().get(key);
					return value != null ? Long.parseLong(value) : null;
				}
			));
	}

	public void setWinner(Long userId) {
		redisTemplate.opsForValue().set(WINNER, userId.toString());
	}

	public Long getWinner() {
		return Long.parseLong(redisTemplate.opsForValue().get(WINNER));
	}

	public void setMaxClicker(Long userId) {
		redisTemplate.opsForValue().set(MAX_CLICKER, userId.toString());
	}

	public Long getMaxClicker() {
		return Long.parseLong(redisTemplate.opsForValue().get(MAX_CLICKER));
	}

	public void setFirstClicker(Long userId) {
		redisTemplate.opsForValue().set(FIRST_CLICKER, userId.toString());
	}

	public Long getFirstClicker() {
		return Long.parseLong(redisTemplate.opsForValue().get(FIRST_CLICKER));
	}

	private void deleteByPattern(String pattern) {
		// 패턴에 맞는 모든 키 조회
		Set<String> keys = redisTemplate.keys(pattern);

		if (keys != null && !keys.isEmpty()) {
			redisTemplate.delete(keys);
		}
	}



	public List<KafkaGameCashLogDto> getAllClickCounts(Long gameId) {
		Set<ZSetOperations.TypedTuple<String>> userCountTuple = redisTemplate.opsForZSet()
			.rangeWithScores(CLICK_COUNT_KEY, 0, -1);

		return userCountTuple.stream()
			.map(tuple -> {
				Long userId = Long.parseLong(
					redisTemplate.opsForValue().get(NICKNAME_KEY + tuple.getValue().replaceAll("^\"|\"$", "")));

				return new KafkaGameCashLogDto(
					userId,
					-Objects.requireNonNull(tuple.getScore()).intValue(),
					getUserCash(userId) - tuple.getScore().intValue(),
					gameId);
			})
			.collect(Collectors.toList());
	}
}

