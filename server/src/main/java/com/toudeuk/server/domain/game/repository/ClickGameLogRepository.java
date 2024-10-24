package com.toudeuk.server.domain.game.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.user.entity.User;

public interface ClickGameLogRepository extends JpaRepository<ClickGameLog, Long> {

	@Query("SELECT COUNT(c) FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
	int countByClickGameId(Long clickGameId);

	@Query("SELECT c.user FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
	Optional<List<User>> findAllUsersByGameId(Long gameId);
}
