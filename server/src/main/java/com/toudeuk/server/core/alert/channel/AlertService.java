package com.toudeuk.server.core.alert.channel;

public interface AlertService {
    void send(String message);
    boolean supports(AlertChannel channel);
}

