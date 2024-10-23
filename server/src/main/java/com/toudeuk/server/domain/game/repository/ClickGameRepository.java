package com.toudeuk.server.domain.game.repository;

import java.util.Optional;

import org.hibernate.LockMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.toudeuk.server.domain.game.entity.ClickGame;

import jakarta.persistence.LockModeType;

public interface ClickGameRepository extends JpaRepository<ClickGame, Long> {

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT cg FROM ClickGame cg WHERE cg.id = :gameId")
	Optional<ClickGame> findByIdWithPessimisticLock(Long gameId);
}