package com.toudeuk.server.core.kafka.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.toudeuk.server.domain.user.entity.CashLogType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KafkaItemBuyDto {

	// 유저 ID, Item ID, changeCash, resultCash, item.getName(), CashLogType.ITEM
	private Long userId;
	private Long itemId;
	private int changeCash;
	private int resultCash;
	private String itemName;
	private CashLogType cashLogType;
}
