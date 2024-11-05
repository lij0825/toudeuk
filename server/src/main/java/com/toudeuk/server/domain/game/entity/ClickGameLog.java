package com.toudeuk.server.domain.game.entity;

import com.toudeuk.server.core.entity.TimeEntity;
import com.toudeuk.server.domain.item.entity.Item;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.entity.UserItem;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "click_game_log")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClickGameLog extends TimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "click_game_log_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_click_game_log_user_id"))
    private User user;

    @Column(name = "click_order", nullable = false)
    private int order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "click_game_id", nullable = false, foreignKey = @ForeignKey(name = "fk_click_game_log_click_game_id"))
    private ClickGame clickGame;

    public static ClickGameLog create(User user, int order, ClickGame clickGame) {
        ClickGameLog clickGameLog = new ClickGameLog();
        clickGameLog.user = user;
        clickGameLog.order = order;
        clickGameLog.clickGame = clickGame;
        return clickGameLog;
    }

}
