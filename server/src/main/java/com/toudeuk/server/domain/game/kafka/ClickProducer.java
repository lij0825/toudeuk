package com.toudeuk.server.domain.game.kafka;

import com.toudeuk.server.domain.game.kafka.dto.ClickDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClickProducer {
	@Value("${producers.topics.click.name}")
	private String TOPIC_CREATE_INSTANCE;

	private final KafkaTemplate<String, ClickDto> kafkaTemplate;

	// ! 카프카 발행 설정 완료 , 로직 추가 해야함.
	public void occurClickUserId(ClickDto clickDto) throws JsonProcessingException {

		kafkaTemplate.send(TOPIC_CREATE_INSTANCE, clickDto);



//		CompletableFuture<SendResult<String, Long>> future = kafkaTemplate.send(TOPIC_CREATE_INSTANCE, userId);
		// 콜백 메서드 생성 해야함.
//		future.thenAccept(result -> {
//			Long value = result.getProducerRecord().value();
//			log.info("success Kafka message: " + value);
//		}).exceptionally(ex -> {
//			log.error("error Kafka message: " + ex.getMessage());
//			throw new BaseException(ErrorCode.KAFKA_PRODUCER_ERROR);
//		});
	}

}
