package com.toudeuk.server.domain.game.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.domain.game.entity.event.ClickEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ClickProducer {
    @Value("${producers.topics.click.name}")
    private String TOPIC_CREATE_INSTANCE;

    private final KafkaTemplate<String, Long> kafkaTemplate;

    // ! 카프카 발행 설정 완료 , 로직 추가 해야함.
    public void occurClickUserId(Long userId) throws JsonProcessingException {

        CompletableFuture<SendResult<String, Long>> future = kafkaTemplate.send(TOPIC_CREATE_INSTANCE, userId);
        // 콜백 메서드 생성 해야함.
        future.thenAccept(result -> {
            Long value = result.getProducerRecord().value();
        }).exceptionally(ex ->{
            throw new BaseException(ErrorCode.KAFKA_PRODUCER_ERROR);
        });
    }

}
