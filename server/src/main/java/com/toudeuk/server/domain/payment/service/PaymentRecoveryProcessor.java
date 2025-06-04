package com.toudeuk.server.domain.payment.service;

import com.toudeuk.server.domain.item.service.ItemService;
import com.toudeuk.server.domain.payment.entity.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component // 또는 @Service
@RequiredArgsConstructor
public class PaymentRecoveryProcessor {

	private final ItemService itemService;
	private final PaymentService paymentService; // Payment 엔티티 저장/업데이트용
	private static final int MAX_RETRY_COUNT = 5; // PaymentRecoveryService와 동일한 값 사용 또는 설정 주입

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void processSinglePaymentRecovery(Payment payment) {
		Long paymentId = payment.getId();
		String partnerOrderId = payment.getPartnerOrderId();
		Long userId = payment.getUser().getId();
		Long itemId;

		try {
			String[] parts = partnerOrderId.split("_");
			if (parts.length < 2) { // userId_itemId_timestamp 형식이어야 함
				log.error("잘못된 partnerOrderId 형식으로 아이템 ID 추출 불가 - Payment ID: {}, partnerOrderId: {}", paymentId, partnerOrderId);
				// 이 경우 재시도 횟수를 늘리지 않고 상태를 변경하지 않음 (다음 스케줄링에서 다시 시도될 수 있음)
				// 또는 특정 상태로 변경하여 관리자가 확인하도록 할 수 있습니다.
				// 예: payment.markAsRequiresManualCheck(); paymentService.save(payment);
				return;
			}
			itemId = Long.parseLong(parts[1]);
		} catch (NumberFormatException e) {
			log.error("partnerOrderId에서 아이템 ID 파싱 실패 - Payment ID: {}, partnerOrderId: {}. 오류: {}", paymentId, partnerOrderId, e.getMessage());
			// 이 경우도 재시도 횟수를 늘리지 않거나, 특정 상태로 변경
			return;
		} catch (Exception e) {
			log.error("아이템 ID 추출 중 예기치 않은 오류 - Payment ID: {}, partnerOrderId: {}. 오류: {}", paymentId, partnerOrderId, e.getMessage(), e);
			return;
		}

		log.info("아이템 지급 재시도 시작 - Payment ID: {}, 사용자 ID: {}, 아이템 ID: {}, 현재 시도 횟수: {}",
			paymentId, userId, itemId, payment.getRetryCount());

		try {
			itemService.giveItemAfterPayment(userId, itemId, partnerOrderId);
			payment.markAsItemSuccess();
			// paymentService.save(payment)는 PaymentService 내부에서 REQUIRES_NEW로 관리되므로,
			// 이 트랜잭션(processSinglePaymentRecovery)에 포함되어 커밋/롤백됩니다.
			// 만약 PaymentService.save가 REQUIRES_NEW가 아니라면 여기서 직접 paymentRepository.save를 호출해야 합니다.
			// 현재 PaymentService.save는 REQUIRES_NEW이므로 그대로 사용합니다.
			paymentService.save(payment);
			log.info("아이템 지급 재시도 성공 - Payment ID: {}", paymentId);
		} catch (Exception e) {
			log.error("아이템 지급 재시도 실패 - Payment ID: {}. 오류: {}", paymentId, e.getMessage(), e);
			payment.increaseRetryCount();
			payment.markAsItemDeliveryFailed(); // Payment 엔티티의 상태를 ITEM_FAILED로 변경
			paymentService.save(payment);

			if (payment.getRetryCount() != null && payment.getRetryCount() >= MAX_RETRY_COUNT) {
				log.warn("최대 재시도 횟수 초과 - Payment ID: {}. 수동 확인 필요.", paymentId);
				// 여기에 관리자 알림 로직 등을 추가할 수 있습니다.
			}
		}
	}
}