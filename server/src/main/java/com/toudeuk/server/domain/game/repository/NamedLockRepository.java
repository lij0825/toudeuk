package com.toudeuk.server.domain.game.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NamedLockRepository {

    @Modifying
    @Query(value = "SELECT GET_LOCK(:lockName, 10)", nativeQuery = true)
    Integer getLock(String lockName);

    @Modifying
    @Query(value = "SELECT RELEASE_LOCK(:lockName)", nativeQuery = true)
    Integer releaseLock(String lockName);
}
