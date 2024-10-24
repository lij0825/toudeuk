package com.toudeuk.server.domain.game.dto;

import java.util.List;

import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.user.entity.User;

import lombok.Data;

public class HistoryData {

	@Data
	public static class RewardLogInfo {
		private User winner;
		private Integer winnerClickCount;
		private User maxClicker;
		private Integer maxClickerClickCount;
		private List<User> middleUsers;

		public static RewardLogInfo of(User winner, Integer winnerClickCount, User maxClicker,
			Integer maxClickerClickCount,
			List<User> middleUsers) {
			RewardLogInfo rewardLogInfo = new RewardLogInfo();
			rewardLogInfo.winner = winner;
			rewardLogInfo.winnerClickCount = winnerClickCount;
			rewardLogInfo.maxClicker = maxClicker;
			rewardLogInfo.maxClickerClickCount = maxClickerClickCount;
			rewardLogInfo.middleUsers = middleUsers;
			return rewardLogInfo;
		}
	}

	@Data
	public static class RewardUser {
		private String nickname;
		private String profileImg;
		private int clickCount;

		public static RewardUser of(User user, int clickCount) {
			RewardUser rewardUser = new RewardUser();
			rewardUser.nickname = user.getName();
			rewardUser.profileImg = user.getProfileImg();
			rewardUser.clickCount = clickCount;
			return rewardUser;
		}
	}

	@Data
	public static class AllInfo {

		private Long click_game_id;
		private Long round;
		private String createdAt;

		private RewardUser winner;
		private RewardUser maxClicker;

		public static AllInfo of(
			ClickGame clickGame,
			User winner,
			int winnerClickCount,
			User maxClicker,
			int maxClickerClickCount) {
			AllInfo allInfo = new AllInfo();
			allInfo.click_game_id = clickGame.getId();
			allInfo.round = clickGame.getRound();
			allInfo.createdAt = clickGame.getCreatedAt().toString();
			allInfo.winner = RewardUser.of(winner, winnerClickCount);
			allInfo.maxClicker = RewardUser.of(maxClicker, maxClickerClickCount);
			return allInfo;
		}
	}

	@Data
	public static class DetailInfo {
		private Long click_game_id;
		private Long round;
		private String createdAt;

		private RewardUser winner;
		private RewardUser maxClicker;
		private List<RewardUser> middleRewardUsers;

		private List<RewardUser> allUsers;

		public static DetailInfo of(
			ClickGame clickGame,
			User winner,
			int winnerClickCount,
			User maxClicker,
			int maxClickerClickCount,
			List<User> middleRewardUsers,
			List<User> allUsers
		) {
			DetailInfo detailInfo = new DetailInfo();
			detailInfo.click_game_id = clickGame.getId();
			detailInfo.round = clickGame.getRound();
			detailInfo.createdAt = clickGame.getCreatedAt().toString();
			detailInfo.winner = RewardUser.of(winner, winnerClickCount);
			detailInfo.maxClicker = RewardUser.of(maxClicker, maxClickerClickCount);
			detailInfo.middleRewardUsers = middleRewardUsers.stream().map(
				user -> RewardUser.of(user, 0)
			).toList();
			detailInfo.allUsers = allUsers.stream().map(
				user -> RewardUser.of(user, 0)
			).toList();
			return detailInfo;
		}
	}

}
