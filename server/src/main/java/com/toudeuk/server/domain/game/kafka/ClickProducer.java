package com.toudeuk.server.domain.game.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.toudeuk.server.domain.game.kafka.dto.KafkaClickDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClickProducer {

	@Value("${producers.topics.click.name}")
	private String TOPIC_CREATE_INSTANCE;

	private final KafkaTemplate<String, KafkaClickDto> kafkaTemplate;

	// ! 카프카 발행 설정 완료 , 로직 추가 해야함.
	public void occurClickUserId(KafkaClickDto clickDto)  {
		kafkaTemplate.send(TOPIC_CREATE_INSTANCE, clickDto);
	}
}
