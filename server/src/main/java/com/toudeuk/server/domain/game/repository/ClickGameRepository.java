package com.toudeuk.server.domain.game.repository;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClickGameRepository extends JpaRepository<ClickGame, Long> {

    Optional<ClickGame> findByRound(Long round);

}
