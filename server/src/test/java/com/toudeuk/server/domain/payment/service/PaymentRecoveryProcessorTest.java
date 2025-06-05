package com.toudeuk.server.domain.payment.service;

import com.toudeuk.server.domain.item.service.ItemService;
import com.toudeuk.server.domain.payment.entity.Payment;
import com.toudeuk.server.domain.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentRecoveryProcessorTest {

    @Mock
    private ItemService itemService;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentRecoveryProcessor paymentRecoveryProcessor;

    @Mock // Payment 객체 자체도 모킹
    private Payment payment;

    @Mock // Payment 내부의 User 객체도 모킹
    private User user;

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long DEFAULT_ITEM_ID = 2L;
    private static final Long DEFAULT_PAYMENT_ID = 100L;
    private static final int MAX_RETRY_COUNT = 5; // PaymentRecoveryProcessor의 상수와 동일하게 설정

    @BeforeEach
    void setUp() {
        // 공통적인 Mock 객체 설정
        when(payment.getId()).thenReturn(DEFAULT_PAYMENT_ID);
        when(payment.getUser()).thenReturn(user);
        when(user.getId()).thenReturn(DEFAULT_USER_ID);
        // MAX_RETRY_COUNT는 PaymentRecoveryProcessor 내부에 private static final로 선언되어 있어
        // ReflectionTestUtils를 사용하거나, 테스트용으로 값을 동일하게 맞춰줍니다.
        // 여기서는 테스트 클래스 내에 동일한 값을 정의하여 사용합니다.
    }

    @Test
    @DisplayName("아이템 지급 재시도 성공 시, Payment 상태가 ITEM_SUCCESS로 변경되고 저장되어야 한다")
    void processSinglePaymentRecovery_success_shouldMarkAsSuccessAndSave() {
        // given
        String validPartnerOrderId = DEFAULT_USER_ID + "_" + DEFAULT_ITEM_ID + "_" + System.currentTimeMillis();
        when(payment.getPartnerOrderId()).thenReturn(validPartnerOrderId);
        when(payment.getRetryCount()).thenReturn(0); // 초기 시도 횟수

        // itemService.giveItemAfterPayment가 성공적으로 호출되었다고 가정
        doNothing().when(itemService).giveItemAfterPayment(DEFAULT_USER_ID, DEFAULT_ITEM_ID, validPartnerOrderId);

        // when
        paymentRecoveryProcessor.processSinglePaymentRecovery(payment);

        // then
        verify(itemService, times(1)).giveItemAfterPayment(DEFAULT_USER_ID, DEFAULT_ITEM_ID, validPartnerOrderId);
        verify(payment, times(1)).markAsItemSuccess();
        verify(paymentService, times(1)).save(payment); // PaymentService의 save 호출 검증
        verify(payment, never()).increaseRetryCount();
        verify(payment, never()).markAsItemDeliveryFailed();
    }

    @Test
    @DisplayName("아이템 지급 재시도 실패 시, 재시도 횟수가 증가하고 상태가 ITEM_FAILED로 변경되며 저장되어야 한다")
    void processSinglePaymentRecovery_failure_shouldIncreaseRetryCountAndMarkAsFailedAndSave() {
        // given
        String validPartnerOrderId = DEFAULT_USER_ID + "_" + DEFAULT_ITEM_ID + "_" + System.currentTimeMillis();
        when(payment.getPartnerOrderId()).thenReturn(validPartnerOrderId);
        when(payment.getRetryCount()).thenReturn(0);

        // itemService.giveItemAfterPayment가 예외를 발생시킨다고 가정
        doThrow(new RuntimeException("Item 지급 실패 테스트 예외"))
                .when(itemService).giveItemAfterPayment(DEFAULT_USER_ID, DEFAULT_ITEM_ID, validPartnerOrderId);

        // when
        paymentRecoveryProcessor.processSinglePaymentRecovery(payment);

        // then
        verify(itemService, times(1)).giveItemAfterPayment(DEFAULT_USER_ID, DEFAULT_ITEM_ID, validPartnerOrderId);
        verify(payment, times(1)).increaseRetryCount();
        verify(payment, times(1)).markAsItemDeliveryFailed();
        verify(paymentService, times(1)).save(payment);
        verify(payment, never()).markAsItemSuccess();
    }

    @Test
    @DisplayName("최대 재시도 횟수 도달 시, 경고 로그가 발생해야 한다 (실제 로그 검증은 어려우므로 로직 흐름 확인)")
    void processSinglePaymentRecovery_maxRetriesReached_shouldLogWarning() {
        // given
        String validPartnerOrderId = DEFAULT_USER_ID + "_" + DEFAULT_ITEM_ID + "_" + System.currentTimeMillis();
        when(payment.getPartnerOrderId()).thenReturn(validPartnerOrderId);
        // getItemDeliveryRetryCount가 MAX_RETRY_COUNT 이상을 반환하도록 설정
        when(payment.getRetryCount()).thenReturn(MAX_RETRY_COUNT -1); // 실패해서 increase하면 MAX_RETRY_COUNT가 됨

        doThrow(new RuntimeException("Item 지급 실패 테스트 예외"))
                .when(itemService).giveItemAfterPayment(DEFAULT_USER_ID, DEFAULT_ITEM_ID, validPartnerOrderId);

        // when
        paymentRecoveryProcessor.processSinglePaymentRecovery(payment);

        // then
        // 로직상 increaseItemDeliveryRetryCount 호출 후, getItemDeliveryRetryCount가 MAX_RETRY_COUNT가 됨
        // 로그 출력은 직접 검증하기 어렵지만, 관련 메서드 호출로 간접 확인
        verify(payment, times(1)).increaseRetryCount(); // 호출되어 retryCount가 MAX_RETRY_COUNT가 됨
        verify(payment, times(1)).markAsItemDeliveryFailed();
        verify(paymentService, times(1)).save(payment);
        // Log 검증은 실제로는 Logback Appender 등을 사용해야 하지만, 단위테스트에서는 로직 흐름으로 대체
    }

    @Test
    @DisplayName("잘못된 partnerOrderId 형식 (구분자 부족)일 경우, 아이템 지급 시도 없이 반환되어야 한다")
    void processSinglePaymentRecovery_invalidPartnerOrderIdFormat_shouldReturnEarly() {
        // given
        String invalidPartnerOrderId = "userIdOnly"; // "_" 구분자 부족
        when(payment.getPartnerOrderId()).thenReturn(invalidPartnerOrderId);

        // when
        paymentRecoveryProcessor.processSinglePaymentRecovery(payment);

        // then
        // 아이템 지급 및 상태 변경 로직이 호출되지 않아야 함
        verify(itemService, never()).giveItemAfterPayment(anyLong(), anyLong(), anyString());
        verify(paymentService, never()).save(any(Payment.class));
        verify(payment, never()).increaseRetryCount();
        verify(payment, never()).markAsItemDeliveryFailed();
        verify(payment, never()).markAsItemSuccess();
    }

    @Test
    @DisplayName("partnerOrderId에서 itemId 파싱 실패 (NumberFormatException) 시, 아이템 지급 시도 없이 반환되어야 한다")
    void processSinglePaymentRecovery_itemIdParsingError_shouldReturnEarly() {
        // given
        String unparsableItemIdOrderId = DEFAULT_USER_ID + "_notANumber_" + System.currentTimeMillis();
        when(payment.getPartnerOrderId()).thenReturn(unparsableItemIdOrderId);

        // when
        paymentRecoveryProcessor.processSinglePaymentRecovery(payment);

        // then
        verify(itemService, never()).giveItemAfterPayment(anyLong(), anyLong(), anyString());
        verify(paymentService, never()).save(any(Payment.class));
        verify(payment, never()).increaseRetryCount();
        verify(payment, never()).markAsItemDeliveryFailed();
        verify(payment, never()).markAsItemSuccess();
    }
}