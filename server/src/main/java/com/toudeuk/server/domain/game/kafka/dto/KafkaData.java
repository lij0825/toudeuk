package com.toudeuk.server.domain.game.kafka.dto;

import com.toudeuk.server.domain.game.dto.GameData;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;
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
        public static KafkaData.ClickDto of(
                Long gameId,
                Long userId,
                int changeCash,
                int resultCash,
                String cashName,
                CashLogType cashLogType) {
            KafkaData.ClickDto clickDto = new KafkaData.ClickDto();
            clickDto.gameId = gameId;
            clickDto.userId = userId;
            clickDto.changeCash = changeCash;
            clickDto.resultCash = resultCash;
            clickDto.cashName = cashName;
            clickDto.cashLogType = cashLogType;

            return clickDto;
        }
}
