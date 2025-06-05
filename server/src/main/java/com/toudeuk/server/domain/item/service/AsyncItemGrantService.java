package com.toudeuk.server.domain.item.service;

import com.toudeuk.server.core.alert.channel.AlertChannel;
import com.toudeuk.server.core.alert.AsyncAlertManager;
import com.toudeuk.server.domain.payment.entity.Payment;
import com.toudeuk.server.domain.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class AsyncItemGrantService {

    private final PaymentService paymentService;
    private final ItemGrantService itemGrantService;
    private final AsyncAlertManager asyncAlertManager;


    @Async
    public void retryGrantItem(Long userId, Long itemId, String partnerOrderId) {
        for (int attempt = 1; attempt <= 3; attempt++) {
            if (tryGrantItem(userId, itemId, partnerOrderId, attempt)) {
                return;
            }
            sleepBackoff();
        }
        notifyRetryFailure(partnerOrderId);
    }

    private boolean tryGrantItem(Long userId, Long itemId, String partnerOrderId, int attempt) {
        try {
            Payment payment = paymentService.findByPartnerOrderId(partnerOrderId);

            if (payment.isItemGranted()) {
                log.info("이미 지급된 결제입니다. partnerOrderId={}", partnerOrderId);
                return true;
            }

            itemGrantService.giveItemAfterPayment(userId, itemId, partnerOrderId);
            log.info("비동기 지급 성공 ({}회차): partnerOrderId={}", attempt, partnerOrderId);
            return true;

        } catch (Exception e) {
            log.warn("비동기 지급 {}회차 실패: partnerOrderId={}, error={}", attempt, partnerOrderId, e.getMessage());
            increaseRetryCountWithAlert(partnerOrderId);
            return false;
        }
    }

    private void increaseRetryCountWithAlert(String partnerOrderId) {
        try {
            paymentService.increaseRetryCount(partnerOrderId);
        } catch (Exception ex) {
            log.error("retryCount 증가 실패: partnerOrderId={}, error={}", partnerOrderId, ex.getMessage());
            String alertMessage = String.format("retryCount 증가 실패: partnerOrderId=%s", partnerOrderId);
            asyncAlertManager.sendAsync(AlertChannel.SLACK,alertMessage);
        }
    }

    private void notifyRetryFailure(String partnerOrderId) {
        log.error("비동기 지급 3회 실패: partnerOrderId={}", partnerOrderId);
        String alertMessage = String.format("비동기 지급 3회 실패: partnerOrderId=%s", partnerOrderId);
        asyncAlertManager.sendAsync(AlertChannel.SLACK,alertMessage);
    }

    private void sleepBackoff() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ignored) {}
    }
}
