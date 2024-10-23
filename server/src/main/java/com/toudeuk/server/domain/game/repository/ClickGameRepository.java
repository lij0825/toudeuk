package com.toudeuk.server.domain.game.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toudeuk.server.domain.game.entity.ClickGame;

public interface ClickGameRepository extends JpaRepository<ClickGame, Long> {

}