package com.toudeuk.server.domain.payment.domain;

import com.toudeuk.server.domain.kapay.dto.ReadyRequest;
import com.toudeuk.server.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tid; // KakaoPay 거래 ID

    private String partnerOrderId;
    private String partnerUserId;

    private String itemName;
    private Integer totalAmount;
    private Integer taxFreeAmount;

    private String approvalUrl;
    private String cancelUrl;
    private String failUrl;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Builder
    public static Payment from(ReadyRequest request, String tid, User user) {
        return Payment.builder()
                .tid(tid)
                .partnerOrderId(request.getPartnerOrderId())
                .partnerUserId(request.getPartnerUserId())
                .itemName(request.getItemName())
                .totalAmount(request.getTotalAmount())
                .taxFreeAmount(request.getTaxFreeAmount())
                .approvalUrl(request.getApprovalUrl())
                .cancelUrl(request.getCancelUrl())
                .failUrl(request.getFailUrl())
                .status(PaymentStatus.READY)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void approve(){
        this.status = PaymentStatus.APPROVE;
    }
}