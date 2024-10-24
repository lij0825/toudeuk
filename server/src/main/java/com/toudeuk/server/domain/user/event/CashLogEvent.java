package com.toudeuk.server.domain.user.event;

import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CashLogEvent {
	private User user;
	private int changeCash;
	private int resultCash;
	private String cashName;
	private CashLogType cashLogType;
}
