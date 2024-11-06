package com.toudeuk.server.domain.game.kafka.dto;

import com.toudeuk.server.domain.user.entity.CashLogType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ClickDto {

    private Long userId;
    private Long gameId;
    private int changeCash;
    private int resultCash;
    private String cashName; // 게임라운드
    private CashLogType cashLogType;
    private int totalClickCount;
}
