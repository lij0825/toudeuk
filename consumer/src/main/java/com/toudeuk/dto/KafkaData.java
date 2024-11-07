package com.toudeuk.dto;

import com.toudeuk.enums.CashLogType;

import lombok.Data;

public class KafkaData {

    @Data
    public static class ClickDto {

        private Long gameId;
        private Long userId;
        private int changeCash;
        private int resultCash;
        private String cashName; // 게임라운드
        private CashLogType cashLogType;
    }

}
