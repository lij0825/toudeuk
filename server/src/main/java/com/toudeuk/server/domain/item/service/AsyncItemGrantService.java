package com.toudeuk.server.domain.item.service;

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


    @Async
    public void retryGrantItem(Long userId, Long itemId, String partnerOrderId) {
        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                Payment payment = paymentService.findByPartnerOrderId(partnerOrderId);

                // 이미 지급 완료된 경우 중단
                if (payment.isItemGranted()) {
                    log.info("이미 지급된 결제입니다. partnerOrderId={}", partnerOrderId);
                    return;
                }

                // 아이템 지급 시도
                itemGrantService.giveItemAfterPayment(userId, itemId, partnerOrderId);

                // 성공 시 retryCount 리셋 or 로그만 남기기
                log.info("비동기 지급 성공 ({}회차): partnerOrderId={}", attempt, partnerOrderId);
                return;
            } catch (Exception e) {
                log.warn("비동기 지급 {}회차 실패: partnerOrderId={}, error={}", attempt, partnerOrderId, e.getMessage());

                try {
                    paymentService.increaseRetryCount(partnerOrderId);
                } catch (Exception ex) {
                    log.error("retryCount 증가 실패: partnerOrderId={}, error={}", partnerOrderId, ex.getMessage());
                }

                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ignored) {}
            }
        }

        log.error("비동기 지급 3회 실패: partnerOrderId={}", partnerOrderId);
    }
}
