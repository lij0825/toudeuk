package com.toudeuk;

import java.util.Arrays;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.dto.KafkaChargingDto;
import com.toudeuk.dto.KafkaClickDto;
import com.toudeuk.dto.KafkaItemBuyDto;
import com.toudeuk.service.ConsumerService;

public class Consumer {

	private static final ObjectMapper objectMapper = new ObjectMapper();
	private static final ConsumerService consumerService = ConsumerService.getInstance();



	public static void main(String[] args) throws JsonProcessingException {

		Properties configs = new Properties();
		configs.put("bootstrap.servers", "localhost:9092");
		configs.put("session.timeout.ms", "10000");
		configs.put("group.id", "toudeuk");
		configs.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
		configs.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

		KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(configs);
		consumer.subscribe(Arrays.asList("click", "item-buy", "charge-cash"));


		while (true) {
			ConsumerRecords<String, String> records = consumer.poll(100);
			for (ConsumerRecord<String, String> record : records) {
				String input = record.topic();

				switch (input) {
					case "click":
						KafkaClickDto clickDto = objectMapper.readValue(record.value(), KafkaClickDto.class);
						System.out.println(clickDto);
						consumerService.click(clickDto);
						break;
					case "item-buy":
						KafkaItemBuyDto itemBuyDto = objectMapper.readValue(record.value(), KafkaItemBuyDto.class);
						System.out.println(itemBuyDto);
						consumerService.itemBuy(itemBuyDto);
						break;
					case "charge-cash":
						KafkaChargingDto chargingDto = objectMapper.readValue(record.value(), KafkaChargingDto.class);
						System.out.println(chargingDto);
						consumerService.chargeCash(chargingDto);
						break;
					default:
						throw new IllegalStateException("get message on topic " + record.topic());
				}
			}
		}
	}
}