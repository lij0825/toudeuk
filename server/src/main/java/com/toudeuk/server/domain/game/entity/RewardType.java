package com.toudeuk.server.domain.game.entity;

public enum RewardType {
	// max_clicker, winner, 구간별 리워드 타입 정해야합니다.
	MAX_CLICKER, WINNER, SECTION, NONE, FIRST;

	public static RewardType from(Integer totalClick){
		if(totalClick == 1000){
			return RewardType.WINNER;
		}
		if(totalClick % 100 == 0){
			return RewardType.SECTION;
		}
		if(totalClick == 1){
			return RewardType.FIRST;
		}
		return NONE;
	}
}
