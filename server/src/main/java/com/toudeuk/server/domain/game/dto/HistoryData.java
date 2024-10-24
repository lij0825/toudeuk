package com.toudeuk.server.domain.game.dto;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.user.entity.User;

import lombok.Data;

public class HistoryData {

	@Data
	public static class AllInfo {
		// Game
		private Long click_game_id;
		private Long round;
		private String time;
		// User
		private String winnerName;
		private String winnerImg;
		private String maxClickerName;
		private String maxClickerImg;

		public static AllInfo of(ClickGame clickGame, User winner, User maxClicker) {
			AllInfo allInfo = new AllInfo();
			allInfo.click_game_id = clickGame.getId();
			allInfo.round = clickGame.getRound();
			allInfo.time = clickGame.getCreatedAt().toString();
			allInfo.winnerName = winner.getName();
			allInfo.winnerImg = winner.getProfileImg();
			allInfo.maxClickerName = maxClicker.getName();
			allInfo.maxClickerImg = maxClicker.getProfileImg();
			return allInfo;
		}

	}
}
