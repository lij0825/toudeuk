package com.toudeuk.server.domain.game.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;

public interface ClickGameRewardLogRepository
	extends JpaRepository<ClickGameRewardLog, Long>, ClickGameRewardLogQueryRepository {

}
