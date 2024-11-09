package com.toudeuk.server.core.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker //웹 소켓 메시지를 다룰 수 있게 허용
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/topic"); //발행자가 "/topic"의 경로로 메시지를 주면 구독자들에 게 전달
		config.setApplicationDestinationPrefixes("/app"); // 발행자가 "/app"의 경로로 메시지를 주면 가공을 해서 구독자들에게 전달
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// 모든 호스트에서의 접근을 허용하는 CORS 설정
		registry.addEndpoint("/ws")
			.setAllowedOriginPatterns("*") // 모든 호스트 허용
			.withSockJS();
	}
}