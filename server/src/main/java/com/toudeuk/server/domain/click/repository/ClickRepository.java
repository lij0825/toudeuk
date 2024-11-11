package com.toudeuk.server.domain.click.repository;

import com.toudeuk.server.domain.click.entity.Click;
import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClickRepository extends JpaRepository<Click, Long> {

    // 특정 User와 ClickGame으로 Click 엔티티 가져오기
    Optional<Click> findByUserAndClickGame(User user, ClickGame clickGame);

    @Query("SELECT c FROM Click c WHERE c.clickGame = :clickGame ORDER BY c.count DESC")
    List<Click> findRank(@Param("clickGame") ClickGame clickGame);

    @Query("SELECT COUNT(c) + 1 FROM Click c WHERE c.clickGame = :clickGame AND c.count > (SELECT c2.count FROM Click c2 WHERE c2.clickGame = :clickGame AND c2.user = :user)")
    Optional<Integer> findUserRankInGame(@Param("clickGame") ClickGame clickGame, @Param("user") User user);


}
