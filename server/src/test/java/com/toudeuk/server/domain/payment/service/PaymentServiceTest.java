package com.toudeuk.server.domain.payment.service;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.payment.entity.Payment;
import com.toudeuk.server.domain.payment.entity.PaymentStatus;
import com.toudeuk.server.domain.payment.repository.PaymentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
class PaymentServiceTest {


    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Test
    @DisplayName("결제 완료된 Payment의 상태를 APPROVE로 변경한다.")
    void updateStatusToBenefitGranted() {
        // given
        Payment payment = Payment.builder()
                .tid("T1234567890")
                .partnerOrderId("order_1234")
                .partnerUserId("user_5678")
                .totalAmount(2200)
                .status(PaymentStatus.READY)
                .build();

        paymentRepository.save(payment);

        // when
        Payment findPayment = paymentRepository.findByPartnerOrderId("order_1234").get();
        findPayment.approve();

        // then
        assertThat(findPayment.getStatus()).isEqualTo(PaymentStatus.APPROVE);
    }

    @Test
    @DisplayName("결제 이력을 찾지 못한 경우 예외가 발생한다.")
    void canNotFindPayment() {
        // given
        Payment payment = Payment.builder()
                .tid("T1234567890")
                .partnerOrderId("order_1234")
                .partnerUserId("user_5678")
                .totalAmount(2200)
                .status(PaymentStatus.READY)
                .build();

        paymentRepository.save(payment);

        // when - then
        assertThatThrownBy(() -> paymentService.findByPartnerOrderId("order_12"))
                .isInstanceOf(BaseException.class);
    }
}