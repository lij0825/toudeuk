package com.toudeuk.server.core.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.toudeuk.server.core.kafka.dto.KafkaChargingDto;
import com.toudeuk.server.core.kafka.dto.KafkaClickDto;
import com.toudeuk.server.core.kafka.dto.KafkaItemBuyDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class Producer {

	@Value("${producers.topics.click.name}")
	private String CLICK_TOPIC;

	@Value("${producers.topics.item-buy.name}")
	private String ITEM_BUY_TOPIC;

	@Value("${producers.topics.charge-cash.name}")
	private String CHARGE_CASH_TOPIC;

	private final KafkaTemplate<String, KafkaClickDto> clickKafkaTemplate;
	private final KafkaTemplate<String, KafkaItemBuyDto> itemBuyKafkaTemplate;
	private final KafkaTemplate<String, KafkaChargingDto> chargingKafkaTemplate;


	// ! 카프카 발행 설정 완료 , 로직 추가 해야함.
	public void occurClickUserId(KafkaClickDto clickDto)  {
		clickKafkaTemplate.send(CLICK_TOPIC, clickDto);
	}

	public void occurItemBuy(KafkaItemBuyDto itemBuyDto) {
		log.info("occurItemBuy : {}", itemBuyDto);
		itemBuyKafkaTemplate.send(ITEM_BUY_TOPIC, itemBuyDto);
	}

	public void occurChargeCash(KafkaChargingDto chargingDto) {
		chargingKafkaTemplate.send(CHARGE_CASH_TOPIC, chargingDto);
	}
}
