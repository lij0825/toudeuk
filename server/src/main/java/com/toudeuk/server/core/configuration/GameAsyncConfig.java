package com.toudeuk.server.core.configuration;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

// 비동기 설정 클래스
@EnableAsync
@Configuration
public class GameAsyncConfig {

    @Bean(name = "gameExecutor")
    public Executor cashDecrementExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        int corePoolSize = 5;
        int maxPoolSize = 10;
        int queueCapacity = 100;

        executor.setThreadGroupName("gameExecutor");
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.initialize();

        return executor;
    }
}
