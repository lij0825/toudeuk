package com.toudeuk.server.domain.game.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class NamedLockRepository {

    private final EntityManager entityManager;

    @Transactional
    public Long getLock(String lockName) {
        return (Long) entityManager.createNativeQuery("SELECT GET_LOCK(:lockName, 10)")
                .setParameter("lockName", lockName)
                .getSingleResult();
    }

    @Transactional
    public Long releaseLock(String lockName) {
        return (Long) entityManager.createNativeQuery("SELECT RELEASE_LOCK(:lockName)")
                .setParameter("lockName", lockName)
                .getSingleResult();
    }
}
