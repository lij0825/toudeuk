package com.toudeuk.server.domain.game.entity;

import com.toudeuk.server.core.entity.TimeEntity;
import com.toudeuk.server.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.sql.Time;

@Entity
@Table(name = "click_game_reward_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClickGameRewardLog extends TimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "click_game_reward_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "click_game_id", nullable = false)
    private ClickGame clickGame;

    @Column(name = "reward", nullable = false)
    private int reward;

    @Column(name = "click_count", nullable = false)
    private int clickCount;


    @Column(name = "click_game_reward_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RewardType rewardType;

}
