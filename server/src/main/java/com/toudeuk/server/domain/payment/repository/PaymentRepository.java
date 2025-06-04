package com.toudeuk.server.domain.payment.repository;

import com.toudeuk.server.domain.payment.entity.Payment;
import com.toudeuk.server.domain.payment.entity.PaymentStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPartnerOrderId(String partnerOrderId);

    @Query("SELECT p FROM Payment p WHERE (p.status = :approveStatus OR (p.status = :failedStatus AND p.retryCount < :maxRetry)) AND p.partnerOrderId LIKE '%\\_%\\_%'")
    List<Payment> findPaymentsForItemDeliveryRetry(
        @Param("approveStatus") PaymentStatus approveStatus,
        @Param("failedStatus") PaymentStatus failedStatus,
        @Param("maxRetry") int maxRetry
    );
}
