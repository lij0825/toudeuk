package com.toudeuk.server.core.kafka.fallback.repository;

import com.toudeuk.server.core.kafka.fallback.entity.FallbackLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FallbackLogRepository extends JpaRepository<FallbackLog, Long> {
    List<FallbackLog> findTop100ByStatusOrderByCreatedAtAsc(FallbackLog.Status status);
}