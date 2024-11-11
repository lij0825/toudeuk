package com.toudeuk.server.domain.click.entity;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Click {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_click_user_id"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_click_user_id"))
    private ClickGame clickGame;

    @Column(name = "click_game_round", nullable = false)
    private Integer count;

    public static Click of(User user, ClickGame clickGame) {
        Click click = new Click();
        click.user = user;
        click.clickGame = clickGame;
        click.count = 0;
        return click;
    }

    public Integer plusCount(){
        this.count++;
        return count;
    }
}
