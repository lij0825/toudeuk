package com.toudeuk.server.domain.user.dto;

import com.toudeuk.server.domain.item.entity.Item;
import com.toudeuk.server.domain.user.entity.CashLog;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;

import lombok.Data;

public class UserData {

	@Data
	public static class Info {
		private String nickName;
		private String profileImg;
		private int cash;

		public static Info of(User user) {
			Info info = new Info();
			info.nickName = user.getNickName();
			info.profileImg = user.getProfileImg();
			info.cash = user.getCash();
			return info;
		}
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
		//item
		private String itemName;
		private String itemImage;
		private int itemPrice;
		// userItem
		private boolean isUsed;
		private String createdAt;

		public static UserItemInfo of(Item item, boolean isUsed, String createdAt) {
			UserItemInfo userItemInfo = new UserItemInfo();
			userItemInfo.itemName = item.getName();
			userItemInfo.itemImage = item.getImage();
			userItemInfo.itemPrice = item.getPrice();
			userItemInfo.isUsed = isUsed;
			userItemInfo.createdAt = createdAt;
			return userItemInfo;
		}
	}
}
