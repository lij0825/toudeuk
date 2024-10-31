package com.toudeuk.server.domain.user.event;

import com.toudeuk.server.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserPaymentEvent {
	private User user;
	private Integer cash;
}
