package com.toudeuk.dto;

import com.toudeuk.enums.CashLogType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ClickDto {

	private Long userId;
	private Long gameId;
	private int changeCash;
	private int resultCash;
	private String cashName; // 게임라운드
	private CashLogType cashLogType;
	private int totalClickCount;
}
