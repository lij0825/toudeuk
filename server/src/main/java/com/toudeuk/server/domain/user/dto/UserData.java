package com.toudeuk.server.domain.user.dto;

import org.springframework.web.multipart.MultipartFile;

import com.toudeuk.server.domain.game.entity.ClickGameRewardLog;
import com.toudeuk.server.domain.game.entity.RewardType;
import com.toudeuk.server.domain.item.entity.Item;
import com.toudeuk.server.domain.item.entity.ItemType;
import com.toudeuk.server.domain.user.entity.CashLog;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;

import lombok.Data;

public class UserData {

	@Data
	public static class Info {
		private Long userId;
		private String nickName;
		private String profileImg;
		private int cash;

		public static Info of(User user, int cash) {
			Info info = new Info();
			info.userId = user.getId();
			info.nickName = user.getNickname();
			info.profileImg = user.getProfileImg();
			info.cash = cash;
			return info;
		}
	}

	@Data
	public static class ChangeInfo {
		private String nickname;
		private String profileImage;

		public static ChangeInfo of(String nickname, String profileImage) {
			ChangeInfo changeInfo = new ChangeInfo();
			changeInfo.nickname = nickname;
			changeInfo.profileImage = profileImage;
			return changeInfo;
		}
	}

	@Data
	public static class UpdateInfo {
		private String nickname;
		private MultipartFile profileImage;
	}

	@Data
	public static class UserCashLog {
		private CashLogType type;
		private int changeCash;
		private int resultCash;
		private String createdAt;

		public static UserCashLog of(CashLog cashLog) {
			UserCashLog log = new UserCashLog();
			log.type = cashLog.getCashLogType();
			log.changeCash = cashLog.getChangeCash();
			log.resultCash = cashLog.getResultCash();
			log.createdAt = cashLog.getCreatedAt().toString();
			return log;
		}
	}

	@Data
	public static class UserItemInfo {
		private Long userItemId;
		//item
		private String itemName;
		private String itemImage;
		private int itemPrice;
		private ItemType itemType;
		// userItem
		private boolean isUsed;
		private String createdAt;

		public static UserItemInfo of(Long userItemId, Item item, boolean isUsed, String createdAt) {
			UserItemInfo userItemInfo = new UserItemInfo();
			userItemInfo.userItemId = userItemId;
			userItemInfo.itemName = item.getName();
			userItemInfo.itemImage = item.getImage();
			userItemInfo.itemPrice = item.getPrice();
			userItemInfo.itemType = item.getItemType();
			userItemInfo.isUsed = isUsed;
			userItemInfo.createdAt = createdAt;
			return userItemInfo;
		}
	}

	@Data
	public static class UserRewardLog {

		private Long clickGameId; // 라운드
		private Integer reward;
		private RewardType rewardType;

		public static UserRewardLog of(ClickGameRewardLog clickGameRewardLog) {
			UserRewardLog userRewardLog = new UserRewardLog();
			userRewardLog.clickGameId = clickGameRewardLog.getClickGame().getId();
			userRewardLog.reward = clickGameRewardLog.getReward();
			userRewardLog.rewardType = clickGameRewardLog.getRewardType();
			return userRewardLog;
		}
	}

	@Data
	public static class UserItemUse {
		private Long userItemId;
	}
}
