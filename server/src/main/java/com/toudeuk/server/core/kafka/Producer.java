package com.toudeuk.server.core.kafka;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.server.core.kafka.fallback.entity.FallbackLog;
import com.toudeuk.server.core.kafka.fallback.entity.Source;
import com.toudeuk.server.core.kafka.fallback.repository.FallbackLogRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.toudeuk.server.core.kafka.dto.KafkaChargingDto;
import com.toudeuk.server.core.kafka.dto.KafkaClickDto;
import com.toudeuk.server.core.kafka.dto.KafkaGameCashLogDto;
import com.toudeuk.server.core.kafka.dto.KafkaItemBuyDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.toudeuk.server.core.util.CookieUtils.serialize;

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

	@Value("${producers.topics.game-cash-log.name}")
	private String GAME_CASH_LOG_TOPIC;

	private final KafkaTemplate<String, KafkaClickDto> clickKafkaTemplate;
	private final KafkaTemplate<String, KafkaItemBuyDto> itemBuyKafkaTemplate;
	private final KafkaTemplate<String, KafkaChargingDto> chargingKafkaTemplate;
	private final KafkaTemplate<String, List<KafkaGameCashLogDto>> gameCashLogKafkaTemplate;
	private final FallbackLogRepository fallbackLogRepository;

	
	public void occurClickUserId(KafkaClickDto clickDto)  {
		try {
			clickKafkaTemplate.send(CLICK_TOPIC, clickDto).get(); // blocking 전송
		} catch (Exception e) {
			log.error("Kafka 전송 실패: CLICK_TOPIC", e);
			fallbackLogRepository.save(FallbackLog.of(CLICK_TOPIC, null, serialize(clickDto), Source.PRODUCER));
		}
	}

	private String serialize(Object dto) {
		try {
			return new ObjectMapper().writeValueAsString(dto);
		} catch (JsonProcessingException e) {
			log.error("Kafka DTO 직렬화 실패", e);
			return "";
		}
	}

	public void occurItemBuy(KafkaItemBuyDto itemBuyDto) {
		log.info("occurItemBuy : {}", itemBuyDto);
		itemBuyKafkaTemplate.send(ITEM_BUY_TOPIC, itemBuyDto);
	}

	public void occurChargeCash(KafkaChargingDto chargingDto) {
		chargingKafkaTemplate.send(CHARGE_CASH_TOPIC, chargingDto);
	}

	public void occurGameCashLog(List<KafkaGameCashLogDto> gameCashLogs) {

		gameCashLogKafkaTemplate.send(GAME_CASH_LOG_TOPIC, gameCashLogs);
	}
}
