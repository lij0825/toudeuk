package com.toudeuk.server.domain.user.entity;

import com.toudeuk.server.core.entity.TimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cash_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CashLog extends TimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cash_log_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "cash_name", nullable = false)
    private String name;

    @Column(name = "change_cash", nullable = false)
    private int changeCash;

    @Column(name = "result_cash", nullable = false)
    private int resultCash;

    @Column(name = "cash_log_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private CashLogType cashLogType;

}
