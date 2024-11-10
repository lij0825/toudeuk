package com.toudeuk.server.domain.game.repository;

import com.toudeuk.server.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.toudeuk.server.domain.game.entity.ClickGameLog;

import java.util.List;

public interface ClickGameLogRepository extends JpaRepository<ClickGameLog, Long>, ClickGameLogQueryRepository {



	@Query("SELECT c FROM ClickGameLog c WHERE c.clickGame.id = :gameId")
	Page<ClickGameLog> findByGameId(@Param("gameId") Long gameId, Pageable pageable);


	@Query("SELECT cg FROM ClickGameLog cg ORDER BY cg.id DESC")
	Page<ClickGameLog> findAllByOrderByIdDesc(Pageable pageable);

	@Query("SELECT COUNT(c) FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
	int countByClickGameId(Long clickGameId);

//	user, clickGame, reward, totalClick, clickDto.getRewardType()
	@Query("SELECT c.user FROM ClickGameLog c WHERE c.user.nickname IN :maxClickerList ORDER BY c.id ASC")
	List<User> findFirstMaxClicker(List<String> maxClickerList);


	// @Query("SELECT c.user, c.order FROM ClickGameLog c WHERE c.clickGame.id = :clickGameId")
	// Optional<List<User>> findAllUsersByGameId(Long clickGameId);
}
