package com.toudeuk.server.domain.payment.service;

import com.toudeuk.server.domain.payment.entity.Payment;
import com.toudeuk.server.domain.payment.entity.PaymentStatus;
import com.toudeuk.server.domain.payment.repository.PaymentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
// import static org.mockito.Mockito.lenient; // lenient() 사용 시 필요

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // JUnit 5와 Mockito 연동
class PaymentRecoveryServiceTest {

    @Mock // Mock 객체 생성
    private PaymentRepository paymentRepository;

    @Mock // Mock 객체 생성
    private PaymentRecoveryProcessor paymentRecoveryProcessor;

    @InjectMocks // @Mock으로 생성된 객체들을 주입받는 테스트 대상 객체
    private PaymentRecoveryService paymentRecoveryService;

    // PaymentRecoveryService에 정의된 상수 값들을 테스트에서도 활용하기 위해 가져옴
    private static final int MAX_RETRY_COUNT = 5;
    // private static final int PROCESS_THRESHOLD_MINUTES = 10; // 이 테스트에서는 직접 사용되지 않음

    @Test
    @DisplayName("복구 대상 결제 건이 없을 때, processSinglePaymentRecovery가 호출되지 않아야 한다")
    void recoverFailedItemDeliveries_noPaymentsToProcess_shouldNotCallProcessor() {
        // given
        when(paymentRepository.findPaymentsForItemDeliveryRetry(
                eq(PaymentStatus.APPROVE),
                eq(PaymentStatus.ITEM_FAILED),
                eq(MAX_RETRY_COUNT),
                any(LocalDateTime.class) // 시간은 정확한 값보다 타입으로 매칭
        )).thenReturn(Collections.emptyList());

        // when
        paymentRecoveryService.recoverFailedItemDeliveries();

        // then
        verify(paymentRecoveryProcessor, never()).processSinglePaymentRecovery(any(Payment.class));
        verify(paymentRepository, times(1)).findPaymentsForItemDeliveryRetry(
                any(), any(), anyInt(), any(LocalDateTime.class)
        );
    }

    @Test
    @DisplayName("복구 대상 결제 건이 있을 때, 각 건에 대해 processSinglePaymentRecovery가 호출되어야 한다")
    void recoverFailedItemDeliveries_paymentsToProcess_shouldCallProcessorForEachPayment() {
        // given
        Payment payment1 = mock(Payment.class);
        Payment payment2 = mock(Payment.class);
        List<Payment> paymentsToProcess = List.of(payment1, payment2);

        when(paymentRepository.findPaymentsForItemDeliveryRetry(
                eq(PaymentStatus.APPROVE),
                eq(PaymentStatus.ITEM_FAILED),
                eq(MAX_RETRY_COUNT),
                any(LocalDateTime.class)
        )).thenReturn(paymentsToProcess);

        // when
        paymentRecoveryService.recoverFailedItemDeliveries();

        // then
        verify(paymentRecoveryProcessor, times(1)).processSinglePaymentRecovery(payment1);
        verify(paymentRecoveryProcessor, times(1)).processSinglePaymentRecovery(payment2);
        verify(paymentRepository, times(1)).findPaymentsForItemDeliveryRetry(
                any(), any(), anyInt(), any(LocalDateTime.class)
        );
    }

    @Test
    @DisplayName("Processor 호출 중 예외 발생 시, 다음 Payment 처리를 계속 진행해야 한다")
    void recoverFailedItemDeliveries_exceptionInProcessor_shouldContinueProcessing() {
        // given
        Payment payment1 = mock(Payment.class);
        // lenient().when(payment1.getId()).thenReturn(1L); // 오류 지속 시 lenient() 사용 고려
        when(payment1.getId()).thenReturn(1L); // 로그 출력을 위해 ID 모킹 (오류 발생 지점)

        Payment payment2 = mock(Payment.class);
        // when(payment2.getId()).thenReturn(2L); // 이 스터빙은 payment2 처리 시 예외가 발생하지 않으므로 불필요함. 제거.

        List<Payment> paymentsToProcess = List.of(payment1, payment2);

        when(paymentRepository.findPaymentsForItemDeliveryRetry(
                any(), any(), anyInt(), any(LocalDateTime.class)
        )).thenReturn(paymentsToProcess);

        // payment1 처리 시 예외 발생하도록 설정
        doThrow(new RuntimeException("Test exception for payment1"))
                .when(paymentRecoveryProcessor).processSinglePaymentRecovery(payment1);

        // when
        paymentRecoveryService.recoverFailedItemDeliveries();

        // then
        // payment1에 대해 processor 호출 시도
        verify(paymentRecoveryProcessor, times(1)).processSinglePaymentRecovery(payment1);
        // payment1 처리 실패 후에도 payment2에 대해 processor 호출 시도
        verify(paymentRecoveryProcessor, times(1)).processSinglePaymentRecovery(payment2);
    }
}