package com.toudeuk.server.domain.game.repository;

import com.toudeuk.server.domain.game.entity.ClickGame;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClickGameRepository extends JpaRepository<ClickGame, Long> {
}
