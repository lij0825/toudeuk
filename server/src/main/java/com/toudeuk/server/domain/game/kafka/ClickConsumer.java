package com.toudeuk.server.domain.game.kafka;

import java.io.IOException;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.server.domain.game.kafka.dto.KafkaClickDto;
import com.toudeuk.server.domain.game.service.ClickGameService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class ClickConsumer {

    private final ObjectMapper objectMapper;
    private final ClickGameService clickGameService;

    // ! 카프카 소비 설정 완료 , 로직 추가 해야함.
    @KafkaListener(topics = "${consumers.topics.click.name}", groupId = "${consumers.group-id.topics.click.name}")
    public void consumerClick(ConsumerRecord<String, String> record) throws IOException {
        KafkaClickDto clickDto = objectMapper.readValue(record.value(), KafkaClickDto.class);
        clickGameService.saveGameData(clickDto);
    }
}
