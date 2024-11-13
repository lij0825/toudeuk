package com.toudeuk.server.domain.game.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.toudeuk.server.domain.game.entity.ClickGame;

import jakarta.persistence.LockModeType;

public interface ClickGameRepository extends JpaRepository<ClickGame, Long> {

	Optional<ClickGame> findByRound(Long round);

	@Query("SELECT cg FROM ClickGame cg ORDER BY cg.id DESC")
	Page<ClickGame> findAllByOrderByIdDesc(Pageable pageable);

	@Query("SELECT MAX(cg.round) FROM ClickGame cg")
	Optional<Long> findLastRound();

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT cg FROM ClickGame cg WHERE cg.id = :gameId")
	ClickGame findByGameId(Long gameId);

}
