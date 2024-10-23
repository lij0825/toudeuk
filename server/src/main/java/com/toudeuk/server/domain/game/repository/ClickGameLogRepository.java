package com.toudeuk.server.domain.game.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toudeuk.server.domain.game.entity.ClickGameLog;

public interface ClickGameLogRepository extends JpaRepository<ClickGameLog, Long> {
}
