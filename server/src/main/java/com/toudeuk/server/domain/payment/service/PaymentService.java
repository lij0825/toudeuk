package com.toudeuk.server.domain.payment.service;

import com.toudeuk.server.domain.kapay.dto.ReadyRequest;
import com.toudeuk.server.domain.payment.domain.Payment;
import com.toudeuk.server.domain.payment.repository.PaymentRepository;
import com.toudeuk.server.domain.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public void createPayment(ReadyRequest readyRequest, String tid, User user) {
        Payment payment = Payment.from(readyRequest, tid, user);
        paymentRepository.save(payment);
    }

    public Payment findByPartnerOrderId(String partnerOrderId) {
        return paymentRepository.findByPartnerOrderId(partnerOrderId);
    }
}
