package com.toudeuk.server.domain.payment.repository;

import com.toudeuk.server.domain.payment.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPartnerOrderId(String partnerOrderId);
}
