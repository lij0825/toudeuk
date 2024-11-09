package com.toudeuk.server.core.kafka;

import java.io.IOException;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.server.core.kafka.dto.KafkaChargingDto;
import com.toudeuk.server.core.kafka.dto.KafkaClickDto;
import com.toudeuk.server.core.kafka.dto.KafkaItemBuyDto;
import com.toudeuk.server.domain.game.service.ClickGameService;
import com.toudeuk.server.domain.item.service.ItemService;
import com.toudeuk.server.domain.kapay.service.KapayService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class Consumer {

    private final ObjectMapper objectMapper;
    private final ClickGameService clickGameService;
    private final ItemService itemService;
    private final KapayService kapayService;

    @KafkaListener(topics = "${consumers.topics.click.name}", groupId = "${consumers.group-id.topics.click.name}")
    public void consumerClick(ConsumerRecord<String, String> record) throws IOException {
        KafkaClickDto clickDto = objectMapper.readValue(record.value(), KafkaClickDto.class);
        clickGameService.saveGameData(clickDto);
    }

    @KafkaListener(topics = "${consumers.topics.item-buy.name}", groupId = "${consumers.group-id.topics.click.name}")
    public void consumerItemBuy(ConsumerRecord<String, String> record) throws IOException {
        KafkaItemBuyDto kafkaItemBuyDto = objectMapper.readValue(record.value(), KafkaItemBuyDto.class);
        log.info("kafkaItemBuyDto : {}", kafkaItemBuyDto);

        itemService.saveItemBuyData(kafkaItemBuyDto);
    }

    @KafkaListener(topics = "${consumers.topics.charge-cash.name}", groupId = "${consumers.group-id.topics.click.name}")
    public void consumeChargeCash(ConsumerRecord<String, String> record) throws IOException {
        KafkaChargingDto kafkaChargingDto = objectMapper.readValue(record.value(), KafkaChargingDto.class);
        log.info("kafkaChargingDto : {}", kafkaChargingDto);

        kapayService.chargeCash(kafkaChargingDto);
    }
}
