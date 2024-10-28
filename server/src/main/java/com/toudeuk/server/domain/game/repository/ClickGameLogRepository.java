package com.toudeuk.server.domain.game.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toudeuk.server.domain.game.entity.ClickGameLog;

public interface ClickGameLogRepository extends JpaRepository<ClickGameLog, Long>, ClickGameLogQueryRepository {

	@Query("SELECT COUNT(c) FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
	int countByClickGameId(Long clickGameId);

	// @Query("SELECT c.user, c.order FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
	// Optional<List<User>> findAllUsersByGameId(Long clickGameId);
}
