package com.toudeuk.server.domain.game.kafka;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.server.domain.game.kafka.dto.KafkaData;
import com.toudeuk.server.domain.game.service.ClickGameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Service
@RequiredArgsConstructor
@Slf4j
public class ClickConsumer {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final ClickGameService clickGameService;

    // ! 카프카 소비 설정 완료 , 로직 추가 해야함.
    @KafkaListener(topics = "${consumers.topics.click.name}", groupId = "${consumers.group-id.topics.click.name}")
    public void consumerClick(ConsumerRecord<String, Object> record) throws IOException {
        KafkaData.ClickDto clickDto = objectMapper.readValue((JsonParser) record.value(), KafkaData.ClickDto.class);
        log.info("clickDto : {}", clickDto);
    }

}
