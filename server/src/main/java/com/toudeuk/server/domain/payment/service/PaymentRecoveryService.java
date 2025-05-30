package com.toudeuk.server.domain.payment.service;

import com.toudeuk.server.domain.payment.entity.Payment;
import com.toudeuk.server.domain.payment.entity.PaymentStatus;
import com.toudeuk.server.domain.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional; // 클래스 레벨 트랜잭션 불필요

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentRecoveryService {

	private final PaymentRepository paymentRepository;
	// private final ItemService itemService; // PaymentRecoveryProcessor로 이동
	// private final PaymentService paymentService; // PaymentRecoveryProcessor로 이동
	private final PaymentRecoveryProcessor paymentRecoveryProcessor; // 새로 추가된 서비스 주입

	private static final int MAX_RETRY_COUNT = 5;
	private static final long FIXED_RATE_MS = 5 * 60 * 1000;
	private static final int PROCESS_THRESHOLD_MINUTES = 10;

	@Scheduled(fixedRate = FIXED_RATE_MS)
	public void recoverFailedItemDeliveries() {
		log.info("실패한 아이템 지급 복구 스케줄러 시작");

		LocalDateTime thresholdTime = LocalDateTime.now().minusMinutes(PROCESS_THRESHOLD_MINUTES);
		List<Payment> paymentsToProcess = paymentRepository.findPaymentsForItemDeliveryRetry(
			PaymentStatus.APPROVE,
			PaymentStatus.ITEM_FAILED, // Payment 엔티티의 상태명과 일치해야 합니다.
			MAX_RETRY_COUNT,
			thresholdTime
		);

		if (paymentsToProcess.isEmpty()) {
			log.info("복구할 아이템 지급 내역 없음");
			return;
		}

		log.info("복구 시도 대상 아이템 지급 건수: {}", paymentsToProcess.size());

		for (Payment payment : paymentsToProcess) {
			try {
				// 각 결제 건 처리를 별도 트랜잭션으로 실행 (외부 빈의 메서드 호출)
				paymentRecoveryProcessor.processSinglePaymentRecovery(payment);
			} catch (Exception e) {
				// paymentRecoveryProcessor.processSinglePaymentRecovery 내부에서 예외를 처리하고 로그를 남기지만,
				// 만약 해당 메서드에서 처리되지 않은 예외가 발생하거나, 호출 자체에서 문제가 생길 경우를 대비한 로그
				log.error("Payment ID {} 복구 처리 중 스케줄러 레벨 에러 발생: {}", payment.getId(), e.getMessage(), e);
				// 이 경우 해당 payment는 다음 스케줄링까지 상태가 변경되지 않을 수 있습니다.
			}
		}
		log.info("실패한 아이템 지급 복구 스케줄러 종료");
	}

	// processSinglePaymentRecovery 메서드는 PaymentRecoveryProcessor로 이동했습니다.
}