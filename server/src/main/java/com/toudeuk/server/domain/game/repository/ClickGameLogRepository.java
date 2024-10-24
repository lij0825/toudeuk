package com.toudeuk.server.domain.game.repository;

import com.toudeuk.server.domain.game.entity.ClickGameLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface ClickGameLogRepository extends JpaRepository<ClickGameLog, Long> {

    @Query("SELECT COUNT(c) FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
    int countByClickGameId(Long clickGameId);


}
