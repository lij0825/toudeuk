package com.toudeuk.server.core.entity;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity extends TimeEntity {
    @Column(name = "is_deleted", nullable = false)
    @ColumnDefault("false")
    protected boolean isDeleted = false;
}
