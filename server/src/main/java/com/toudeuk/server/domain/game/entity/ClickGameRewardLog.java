package com.toudeuk.server.domain.game.entity;

import com.toudeuk.server.core.entity.TimeEntity;
import com.toudeuk.server.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "click_game_reward_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClickGameRewardLog extends TimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "click_game_reward_id", nullable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_click_game_reward_log_user_id"))
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "click_game_id", nullable = false,  foreignKey = @ForeignKey(name = "fk_click_game_reward_log_click_game_id"))
	private ClickGame clickGame;

	@Column(name = "reward", nullable = false)
	private int reward;

	@Column(name = "click_count", nullable = false)
	private int clickCount;

	@Column(name = "click_game_reward_type", nullable = false)
	@Enumerated(EnumType.STRING)
	private RewardType rewardType;

	public static ClickGameRewardLog create(User user, ClickGame clickGame, int reward, int clickCount, RewardType rewardType) {
		ClickGameRewardLog clickGameRewardLog = new ClickGameRewardLog();
		clickGameRewardLog.user = user;
		clickGameRewardLog.clickGame = clickGame;
		clickGameRewardLog.reward = reward;
		clickGameRewardLog.clickCount = clickCount;
		clickGameRewardLog.rewardType = rewardType;
		return clickGameRewardLog;
	}

}
