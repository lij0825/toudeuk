package com.toudeuk.server.core.kafka.fallback.service;

import com.toudeuk.server.core.alert.AsyncAlertManager;
import com.toudeuk.server.core.kafka.fallback.entity.FallbackLog;
import com.toudeuk.server.core.kafka.fallback.entity.Source;
import com.toudeuk.server.core.kafka.fallback.repository.FallbackLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FallbackRetryScheduler {

    private final FallbackLogRepository fallbackLogRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final AsyncAlertManager alertManager;
    private static final int MAX_RETRY = 5;

    @Scheduled(fixedDelay = 10000) // 10초마다
    public void retryFailedKafkaSends() {
        List<FallbackLog> pendingLogs = fallbackLogRepository
                .findTop100ByStatusOrderByCreatedAtAsc(FallbackLog.Status.PENDING, Source.PRODUCER);

        for (FallbackLog fallbackLog : pendingLogs) {
            try {
                kafkaTemplate.send(fallbackLog.getTopic(), fallbackLog.getKey(), fallbackLog.getPayload()).get();
                fallbackLog.markSuccess();
                fallbackLogRepository.save(fallbackLog);
            } catch (Exception e) {
                log.error("Fallback 전송 실패: {}", fallbackLog, e);
                fallbackLog.markFailed(MAX_RETRY);
                alertManager.sendAllAsync("Fallback 메시지 잔송에 실패했습니다");
                fallbackLogRepository.save(fallbackLog);
            }
        }
    }
}