package com.toudeuk.server.domain.game.entity;

import com.toudeuk.server.core.entity.TimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "click_game")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClickGame extends TimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "click_game_id", nullable = false)
    private Long id;

    @Column(name = "click_game_round", nullable = false)
    private Long round;

    @Column(name = "click_count", nullable = false)
    private Integer clickCount;

    @Builder
    public ClickGame(Long id, Long round, Integer clickCount) {
        this.id = id;
        this.round = round;
        this.clickCount = clickCount;
    }

    public void click() {
        this.clickCount++;
    }

    public Integer getClickCount() {
        return this.clickCount;
    }
}
