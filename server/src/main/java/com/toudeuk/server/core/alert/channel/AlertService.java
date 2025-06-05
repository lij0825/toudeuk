package com.toudeuk.server.core.alert.channel;

public interface AlertService {
    void send(String message);
    AlertChannel channel();
}

