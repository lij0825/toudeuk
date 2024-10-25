package com.toudeuk.server.domain.game.dto;

import java.util.List;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.RewardType;
import com.toudeuk.server.domain.user.entity.User;

import lombok.Data;

public class HistoryData {

	@Data
	public static class WinnerAndMaxClickerData {
		private RewardUser winner;
		private RewardUser maxClicker;

		public static WinnerAndMaxClickerData of(RewardUser winner, RewardUser maxClicker) {
			WinnerAndMaxClickerData winnerAndMaxClicker = new WinnerAndMaxClickerData();
			winnerAndMaxClicker.winner = winner;
			winnerAndMaxClicker.maxClicker = maxClicker;
			return winnerAndMaxClicker;
		}
	}

	@Data
	public static class RewardUser {
		private String nickname;
		private String profileImg;
		private Integer clickCount;
		private RewardType rewardType;

		public static RewardUser of(User user, Integer clickCount, RewardType rewardType) {
			RewardUser rewardUser = new RewardUser();
			rewardUser.nickname = user.getName();
			rewardUser.profileImg = user.getProfileImg();
			rewardUser.clickCount = clickCount;
			rewardUser.rewardType = rewardType;
			return rewardUser;
		}
	}

	@Data
	public static class BaseInfo {
		private Long clickGameId;
		private Long round;
		private String createdAt;

		public void setCommonFields(ClickGame clickGame) {
			this.clickGameId = clickGame.getId();
			this.round = clickGame.getRound();
			this.createdAt = clickGame.getCreatedAt().toString();
		}
	}

	@Data
	public static class AllInfo extends BaseInfo {
		private RewardUser winner;
		private RewardUser maxClicker;

		public static AllInfo of(ClickGame clickGame,
			WinnerAndMaxClickerData winnerAndMaxClicker) {
			AllInfo allInfo = new AllInfo();
			allInfo.setCommonFields(clickGame);
			allInfo.winner = winnerAndMaxClicker.winner;
			allInfo.maxClicker = winnerAndMaxClicker.maxClicker;
			return allInfo;
		}
	}

	@Data
	public static class DetailInfo extends BaseInfo {
		private RewardUser winner;
		private RewardUser maxClicker;
		private List<RewardUser> middleRewardUsers;
		private List<RewardUser> allUsers;

		public static DetailInfo of(
			ClickGame clickGame,
			WinnerAndMaxClickerData winnerAndMaxClicker,
			List<RewardUser> middleRewardUsers,
			List<RewardUser> allUsers) {
			DetailInfo detailInfo = new DetailInfo();
			detailInfo.setCommonFields(clickGame);
			detailInfo.winner = winnerAndMaxClicker.winner;
			detailInfo.maxClicker = winnerAndMaxClicker.maxClicker;
			detailInfo.middleRewardUsers = middleRewardUsers;
			detailInfo.allUsers = allUsers;
			return detailInfo;
		}
	}
}
