package com.toudeuk.server.domain.kapay.service;

import com.toudeuk.server.domain.item.dto.ItemInfo;
import com.toudeuk.server.domain.item.service.ItemService;
import com.toudeuk.server.domain.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.view.RedirectView;

@RequiredArgsConstructor
@Slf4j
@Component
public class ApproveFacade {

    private final KapayService kapayService;
    private final ItemService itemService;
    private final PaymentService paymentService;

    @Transactional
    public RedirectView handleApprove(String agent, String openType, String pgToken, String partnerOrderId) {
        ResponseEntity<?> response = kapayService.approve(pgToken, partnerOrderId);

        if (response.getStatusCode() != HttpStatus.OK) {
            log.warn("카카오페이 승인 실패: partnerOrderId={}, status={}", partnerOrderId, response.getStatusCode());
            return new RedirectView("/kapay/fail");
        }

        if (!isItemPurchase(partnerOrderId)) {
            log.info("일반 결제 승인 완료: partnerOrderId={}", partnerOrderId);
            return new RedirectView("/kapay/approve");
        }

        try {
            ItemInfo info = parseItemInfo(partnerOrderId);
            itemService.giveItemAfterPayment(info.userId(), info.itemId(), partnerOrderId);
        } catch (Exception e) {
            log.error("아이템 지급 중 예외 발생: {}", e.getMessage(), e);
        }

        return new RedirectView("/kapay/approve");
    }

    private boolean isItemPurchase(String partnerOrderId) {
        return partnerOrderId != null && partnerOrderId.contains("_");
    }

    private ItemInfo parseItemInfo(String partnerOrderId) {
        try {
            String[] parts = partnerOrderId.split("_");
            Long userId = Long.parseLong(parts[0]);
            Long itemId = Long.parseLong(parts[1]);
            return new ItemInfo(userId, itemId);
        } catch (Exception e) {
            throw new IllegalArgumentException("partnerOrderId 형식 오류: " + partnerOrderId, e);
        }
    }
}