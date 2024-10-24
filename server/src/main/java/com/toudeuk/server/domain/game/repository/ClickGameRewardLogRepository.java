package com.toudeuk.server.domain.game.repository;

import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClickGameRewardLogRepository extends JpaRepository<ClickGameRewardLog, Long> {
}
