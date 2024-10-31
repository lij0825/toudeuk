package com.toudeuk.server.domain.game.entity;

import com.toudeuk.server.core.entity.TimeEntity;

import com.toudeuk.server.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "click_game")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClickGame extends TimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "click_game_id", nullable = false)
	private Long id;

	@Column(name = "click_game_round", nullable = false)
	private Long round;

	public static ClickGame create(Long round) {
		ClickGame clickGame = new ClickGame();
		clickGame.round = round;
		return clickGame;
	}

}
