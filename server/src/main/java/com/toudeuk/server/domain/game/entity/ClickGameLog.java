package com.toudeuk.server.domain.game.entity;

import com.toudeuk.server.core.entity.TimeEntity;
import com.toudeuk.server.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "click_game_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClickGameLog extends TimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "click_game_log_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "click_order", nullable = false)
    private int order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "click_game_id", nullable = false)
    private ClickGame clickGame;


    public ClickGameLog(User user, Integer order, ClickGame clickGame) {
        this.id = id;
        this.user = user;
        this.order = order;
        this.clickGame = clickGame;
    }
}
