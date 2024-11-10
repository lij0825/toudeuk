package com.toudeuk.server.domain.game.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.toudeuk.server.domain.game.entity.ClickGameLog;

public interface ClickGameLogRepository extends JpaRepository<ClickGameLog, Long>, ClickGameLogQueryRepository {



	@Query("SELECT c FROM ClickGameLog c WHERE c.clickGame.id = :gameId")
	Page<ClickGameLog> findByGameId(@Param("gameId") Long gameId, Pageable pageable);


	@Query("SELECT cg FROM ClickGameLog cg ORDER BY cg.id DESC")
	Page<ClickGameLog> findAllByOrderByIdDesc(Pageable pageable);

	@Query("SELECT COUNT(c) FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
	int countByClickGameId(Long clickGameId);

	// @Query("SELECT c.user, c.order FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
	// Optional<List<User>> findAllUsersByGameId(Long clickGameId);
}
