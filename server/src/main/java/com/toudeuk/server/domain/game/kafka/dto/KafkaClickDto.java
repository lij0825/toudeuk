package com.toudeuk.server.domain.game.kafka.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.toudeuk.server.domain.game.entity.RewardType;
import com.toudeuk.server.domain.user.entity.CashLogType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KafkaClickDto {

    private Long userId;
    private Long gameId;
    private int totalClickCount;
    private RewardType rewardType;

    public KafkaClickDto(Long userId, Long gameId, int totalClickCount, RewardType rewardType) {
        this.userId = userId;
        this.gameId = gameId;
        this.totalClickCount = totalClickCount;
        this.rewardType = rewardType;
    }
}
