package com.toudeuk.server.core.kafka.fallback.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
public class FallbackLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    private String key;

    @Lob
    private String payload;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private int retryCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime lastTriedAt;

    @Enumerated(EnumType.STRING)
    private Source source;

    public enum Status {
        PENDING,
        SUCCESS,
        FAILED
    }

    // 정적 생성자
    public static FallbackLog of(String topic, String key, String payload, Source source) {
        FallbackLog log = new FallbackLog();
        log.topic = topic;
        log.key = key;
        log.payload = payload;
        log.source = source;
        return log;
    }

    public void markSuccess() {
        this.status = Status.SUCCESS;
        this.retryCount += 1;
        this.lastTriedAt = LocalDateTime.now();
    }

    public void markFailed(int maxRetry) {
        this.retryCount += 1;
        this.lastTriedAt = LocalDateTime.now();
        if (this.retryCount >= maxRetry) {
            this.status = Status.FAILED;
        }
    }
}