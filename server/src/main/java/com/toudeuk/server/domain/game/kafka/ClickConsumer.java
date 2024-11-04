package com.toudeuk.server.domain.game.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.event.ClickEvent;
import com.toudeuk.server.domain.game.service.ClickGameService;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Service
@RequiredArgsConstructor
public class ClickConsumer {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final ClickGameService clickGameService;

    // ! 카프카 소비 설정 완료 , 로직 추가 해야함.
    @KafkaListener(topics = "${consumers.topics.click.name}", groupId = "${consumers.group-id.topics.click.name}")
    public void consumerClick(ConsumerRecord<String, String> record) throws IOException {
        Long userId = objectMapper.readValue(record.value(), Long.class);
        clickGameService.click(userId);
    }

}
