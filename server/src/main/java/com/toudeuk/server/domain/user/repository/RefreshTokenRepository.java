package com.toudeuk.server.domain.user.repository;

import com.toudeuk.server.domain.user.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @Query("select r from RefreshToken r where r.user.id = :userId")
    Optional<RefreshToken> findByUserId(@Param("userId") Long userId);

    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}
