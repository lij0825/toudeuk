package com.toudeuk;

import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.dto.KafkaChargingDto;
import com.toudeuk.dto.KafkaClickDto;
import com.toudeuk.dto.KafkaGameCashLogDto;
import com.toudeuk.dto.KafkaItemBuyDto;
import com.toudeuk.service.ConsumerService;

public class Consumer {

	private static final ObjectMapper objectMapper = new ObjectMapper();
	private static final ConsumerService consumerService = ConsumerService.getInstance();



	public static void main(String[] args) throws JsonProcessingException {

		Properties configs = new Properties();
		configs.put("bootstrap.servers", "43.203.141.23:9092");
		configs.put("session.timeout.ms", "10000");
		configs.put("group.id", "toudeuk");
		configs.put("auto.offset.reset", "earliest");
		configs.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
		configs.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

		KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(configs);
		consumer.subscribe(Arrays.asList("click", "item-buy", "charge-cash", "game-cash-log"));


		while (true) {
			ConsumerRecords<String, String> records = consumer.poll(100);
			for (ConsumerRecord<String, String> record : records) {
				String input = record.topic();
				switch (input) {
					case "click":
						KafkaClickDto clickDto = objectMapper.readValue(record.value(), KafkaClickDto.class);
						consumerService.click(clickDto);
						break;
					case "game-cash-log":
						JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, KafkaGameCashLogDto.class);
						List<KafkaGameCashLogDto> gameCashLogs = objectMapper.readValue(record.value(), type);
						consumerService.gameCashLog(gameCashLogs);
						break;
					case "item-buy":
						KafkaItemBuyDto itemBuyDto = objectMapper.readValue(record.value(), KafkaItemBuyDto.class);
						consumerService.itemBuy(itemBuyDto);
						break;
					case "charge-cash":
						KafkaChargingDto chargingDto = objectMapper.readValue(record.value(), KafkaChargingDto.class);
						consumerService.chargeCash(chargingDto);
						break;
					default:
						throw new IllegalStateException("get message on topic " + record.topic());
				}
			}
		}
	}
}