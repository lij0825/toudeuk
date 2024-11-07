package com.toudeuk;

import java.util.Arrays;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toudeuk.dto.ClickDto;
import com.toudeuk.service.ConsumerService;

public class Consumer {

	private static final ObjectMapper objectMapper = new ObjectMapper();
	private static final ConsumerService consumerService = ConsumerService.getInstance();



	public static void main(String[] args) throws JsonProcessingException {

		Properties configs = new Properties();
		configs.put("bootstrap.servers", "localhost:9092");
		configs.put("session.timeout.ms", "10000");
		configs.put("group.id", "click");
		configs.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
		configs.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

		KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(configs);
		consumer.subscribe(Arrays.asList("click"));

		while (true) {
			ConsumerRecords<String, String> records = consumer.poll(500);
			for (ConsumerRecord<String, String> record : records) {
				String input = record.topic();

				switch (input) {
					case "click":
						ClickDto clickDto = objectMapper.readValue(record.value(), ClickDto.class);
						consumerService.click(clickDto);

						break;
					default:
						throw new IllegalStateException("get message on topic " + record.topic());
				}
			}
		}
	}
}