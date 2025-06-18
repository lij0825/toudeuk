package com.toudeuk.server.core.alert;

import com.toudeuk.server.core.alert.channel.AlertChannel;
import com.toudeuk.server.core.alert.channel.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncAlertManager {

    private final List<AlertService> alertServices;

    @Async
    public void sendAsync(AlertChannel channel, String message) {
        if (channel == null) {
            log.warn("AlertChannel is null. 메시지를 전송하지 않습니다.");
            return;
        }

        alertServices.stream()
                .filter(sender -> sender.supports(channel))  // 해당 채널만 필터링
                .findFirst()
                .ifPresentOrElse(
                        sender -> sender.send(message),
                        () -> log.warn("지원하지 않는 AlertChannel: {}", channel)
                );
    }

    @Async
    public void sendAllAsync(String message) {
        alertServices.forEach(sender -> sender.send(message));
    }
}

