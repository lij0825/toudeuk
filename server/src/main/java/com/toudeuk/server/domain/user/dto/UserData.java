package com.toudeuk.server.domain.user.dto;

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
}
