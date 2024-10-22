package com.toudeuk.server.domain.game.entity;

import com.toudeuk.server.core.entity.TimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "click_game")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClickGame extends TimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "click_game_id", nullable = false)
    private Long id;

    @Column(name = "click_game_round", nullable = false)
    private Long round;

}
