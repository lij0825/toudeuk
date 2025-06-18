package com.toudeuk.server.core.alert.channel;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlackAlertService implements AlertService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${slack.webhook.url}")
    private String slackWebhookUrl;

    @Override
    public void send(String message) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String payload = "{\"text\":\"" + message.replace("\"", "\\\"") + "\"}";
            HttpEntity<String> entity = new HttpEntity<>(payload, headers);

            restTemplate.postForEntity(slackWebhookUrl, entity, String.class);
            log.info("[Slack Alarm Sent] {}", message);
        } catch (Exception e) {
            log.error("Slack 메시지 전송 실패", e);
        }
    }

    @Override
    public boolean supports(AlertChannel channel) {
        return channel == AlertChannel.DISCORD;
    }
}