package com.toudeuk.server.domain.payment.service;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.kapay.dto.ReadyRequest;
import com.toudeuk.server.domain.payment.entity.Payment;
import com.toudeuk.server.domain.payment.repository.PaymentRepository;
import com.toudeuk.server.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.toudeuk.server.core.exception.ErrorCode.ITEM_NOT_FOUND;
import static org.springframework.transaction.annotation.Propagation.REQUIRES_NEW;

@RequiredArgsConstructor
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public void createPayment(ReadyRequest readyRequest, String tid, User user) {
        Payment payment = Payment.from(readyRequest, tid, user);
        paymentRepository.save(payment);
    }

    public Payment findByPartnerOrderId(String partnerOrderId) {
        return paymentRepository.findByPartnerOrderId(partnerOrderId)
                .orElseThrow(() -> new BaseException(ITEM_NOT_FOUND));
    }


    @Transactional(propagation = REQUIRES_NEW, timeout = 3)
    public void markItemSuccess(String partnerOrderId) {
        Payment payment = findByPartnerOrderId(partnerOrderId);
        payment.markAsItemSuccess();
        save(payment);
    }

    @Transactional(propagation = REQUIRES_NEW, timeout = 3)
    public void save(Payment payment) {
        paymentRepository.save(payment);
    }

    @Transactional(propagation = REQUIRES_NEW)
    public void markItemDeliveryFailed(String partnerOrderId) {
        Payment payment = findByPartnerOrderId(partnerOrderId);
        payment.markAsItemDeliveryFailed();
        save(payment);
    }
}
