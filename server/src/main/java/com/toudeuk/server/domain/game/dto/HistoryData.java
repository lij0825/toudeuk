package com.toudeuk.server.domain.game.dto;

import java.util.List;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.entity.ClickGameLog;
import com.toudeuk.server.domain.game.entity.RewardType;
import com.toudeuk.server.domain.user.entity.User;

import lombok.Data;
import lombok.EqualsAndHashCode;

public class HistoryData {

	@Data
	public static class WinnerAndMaxClickerAndFirstClickerData {
		private RewardUser winner;
		private RewardUser maxClicker;
		private RewardUser firstClicker;

		public static WinnerAndMaxClickerAndFirstClickerData of(RewardUser winner, RewardUser maxClicker,
			RewardUser firstClicker) {
			WinnerAndMaxClickerAndFirstClickerData winnerAndMaxClickerAndFirstClicker = new WinnerAndMaxClickerAndFirstClickerData();
			winnerAndMaxClickerAndFirstClicker.winner = winner;
			winnerAndMaxClickerAndFirstClicker.maxClicker = maxClicker;
			winnerAndMaxClickerAndFirstClicker.firstClicker = firstClicker;
			return winnerAndMaxClickerAndFirstClicker;
		}
	}

	@Data
	public static class DetailLog {
		private Long clickGameId;
		private String nickname;
		private String profileImg;
		private Integer clickOrder;
		private String createdAt;

		public static DetailLog of(ClickGameLog clickGameLog, User user) {
			DetailLog detailLog = new DetailLog();
			detailLog.clickGameId = clickGameLog.getId();
			detailLog.nickname = user.getName();
			detailLog.profileImg = user.getProfileImg();
			detailLog.clickOrder = clickGameLog.getOrder();
			detailLog.createdAt = clickGameLog.getCreatedAt().toString();
			return detailLog;
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

	@EqualsAndHashCode(callSuper = true)
	@Data
	public static class AllInfo extends BaseInfo {
		private RewardUser winner;
		private RewardUser maxClicker;

		public static AllInfo of(ClickGame clickGame,
			WinnerAndMaxClickerAndFirstClickerData winnerAndMaxClicker) {
			AllInfo allInfo = new AllInfo();
			allInfo.setCommonFields(clickGame);
			allInfo.winner = winnerAndMaxClicker.winner;
			allInfo.maxClicker = winnerAndMaxClicker.maxClicker;
			return allInfo;
		}
	}

	@Data
	public static class RewardInfo {
		private RewardUser winner;
		private RewardUser maxClicker;
		private RewardUser FirstClicker;
		private List<RewardUser> middleRewardUsers;

		public static RewardInfo of(
			WinnerAndMaxClickerAndFirstClickerData winnerAndMaxClicker,
			List<RewardUser> middleRewardUsers) {
			RewardInfo rewardInfo = new RewardInfo();
			rewardInfo.winner = winnerAndMaxClicker.winner;
			rewardInfo.maxClicker = winnerAndMaxClicker.maxClicker;
			rewardInfo.FirstClicker = winnerAndMaxClicker.firstClicker;
			rewardInfo.middleRewardUsers = middleRewardUsers;
			return rewardInfo;
		}
	}
}
