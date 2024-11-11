package com.toudeuk.server.domain.game.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;

public interface ClickGameRewardLogRepository
	extends JpaRepository<ClickGameRewardLog, Long>, ClickGameRewardLogQueryRepository {

	@Query("SELECT c FROM ClickGameRewardLog c WHERE c.user.id = :userId ORDER BY c.clickGame.id DESC")
	Optional<List<ClickGameRewardLog>> findAllByUserId(Long userId);

}
