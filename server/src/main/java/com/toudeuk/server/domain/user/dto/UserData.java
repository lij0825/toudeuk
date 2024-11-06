package com.toudeuk.server.domain.user.dto;

import com.toudeuk.server.domain.item.entity.ItemType;
import org.springframework.web.multipart.MultipartFile;

import com.toudeuk.server.domain.item.entity.Item;
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

		public static Info of(User user) {
			Info info = new Info();
			info.userId = user.getId();
			info.nickName = user.getNickname();
			info.profileImg = user.getProfileImg();
			info.cash = user.getCash();
			return info;
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
	public static class UserItemUse {
		private Long userItemId;
	}
}
