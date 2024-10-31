package com.toudeuk.server.core.configuration.database;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableJpaAuditing

public class DataBaseConfig {
	private final EntityManager em;

	@Bean
	public JPAQueryFactory queryFactory() {
		return new JPAQueryFactory(em);
	}

}
