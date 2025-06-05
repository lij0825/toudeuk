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
        alertServices.forEach(sender -> sender.send(message));
    }

    @Async
    public void sendAllAsync(String message) {
        alertServices.forEach(sender -> sender.send(message));
    }
}

