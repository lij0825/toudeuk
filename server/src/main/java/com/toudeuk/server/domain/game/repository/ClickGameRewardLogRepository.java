package com.toudeuk.server.domain.game.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;
import com.toudeuk.server.domain.user.entity.User;

public interface ClickGameRewardLogRepository extends JpaRepository<ClickGameRewardLog, Long> {

	@Query("SELECT c.clickCount FROM ClickGameRewardLog c WHERE c.clickGame.id = ?1 AND c.rewardType = 'WINNER'")
	Optional<Integer> findWinnerClickCountByClickGameId(Long clickGameId);

	@Query("SELECT c.user FROM ClickGameRewardLog c WHERE c.clickGame.id = ?1 AND c.rewardType = 'WINNER'")
	Optional<User> findWinnerByClickGameId(Long clickGameId);

	@Query("SELECT c.clickCount FROM ClickGameRewardLog c WHERE c.clickGame.id = ?1 AND c.rewardType = 'MAX_CLICKER'")
	Optional<Integer> findMaxClickerClickCountByClickGameId(Long clickGameId);

	@Query("SELECT c.user FROM ClickGameRewardLog c WHERE c.clickGame.id = ?1 AND c.rewardType = 'MAX_CLICKER'")
	Optional<User> findMaxClickerByClickGameId(Long clickGameId);

	@Query("SELECT c.user FROM ClickGameRewardLog c WHERE c.clickGame.id = ?1 AND c.rewardType = 'SECTION'")
	Optional<List<User>> findMiddleByClickGameId(Long clickGameId);

	// @Query(
	// 	"""
	// 		SELECT
	// 	"""
	// )

}
