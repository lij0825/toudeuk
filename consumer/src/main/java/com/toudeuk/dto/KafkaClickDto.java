package com.toudeuk.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.toudeuk.enums.RewardType;

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
}
