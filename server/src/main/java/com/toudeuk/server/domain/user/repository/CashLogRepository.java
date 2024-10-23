package com.toudeuk.server.domain.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toudeuk.server.domain.user.entity.CashLog;

public interface CashLogRepository extends JpaRepository<CashLog, Long> {
	Optional<List<CashLog>> findByUserId(Long userId);
}
