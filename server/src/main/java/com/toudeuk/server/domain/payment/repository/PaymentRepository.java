package com.toudeuk.server.domain.payment.repository;

import com.toudeuk.server.domain.payment.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByPartnerOrderId(String partnerOrderId);
}
