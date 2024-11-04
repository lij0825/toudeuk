package com.toudeuk.server.core.configuration;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@EnableAsync
@Configuration
public class AsyncConfig {
	@Bean(name = "imageExecutor")
	public Executor imageUploadExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

		int corePoolSize = 5;
		int maxPoolSize = 10;
		int queueCapacity = 100;

		executor.setThreadGroupName("imageExecutor");
		executor.setCorePoolSize(corePoolSize);
		executor.setMaxPoolSize(maxPoolSize);
		executor.setQueueCapacity(queueCapacity);
		executor.initialize();

		return executor;
	}
}
