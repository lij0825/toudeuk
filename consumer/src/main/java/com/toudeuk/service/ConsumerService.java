package com.toudeuk.service;

import com.toudeuk.dao.ToudeukDao;
import com.toudeuk.dto.KafkaClickDto;
import com.toudeuk.enums.RewardType;

public class ConsumerService {
	private static ConsumerService instance;

	private ConsumerService() {
	}

	public static synchronized ConsumerService getInstance() {
		if (instance == null) {
			instance = new ConsumerService();
		}
		return instance;
	}

	private final ToudeukDao toudeukDao = ToudeukDao.getInstance();

	// 클릭 했을 때
	public void click(KafkaClickDto clickDto) {

		System.out.println(clickDto);

		// 게임 로그 저장
		toudeukDao.insertClickLog(
			clickDto.getUserId(),
			clickDto.getGameId(),
			clickDto.getTotalClickCount()
		);

		// 보상 조건이 없으면 그냥 리턴
		if (clickDto.getRewardType().equals(RewardType.NONE)) {
			return ;
		}

		// 첫번째 보상
		if (clickDto.equals(RewardType.FIRST)) {
			toudeukDao.insertRewardLog(
				clickDto.getUserId(),
				clickDto.getGameId(),
				500,
				clickDto.getTotalClickCount(),
				RewardType.FIRST.toString());
			return ;
		}


		// 나머지 보상 마지막 또는 중간중간 보상 어차피 계산값 동일
		toudeukDao.insertRewardLog(
			clickDto.getUserId(),
			clickDto.getGameId(),
			clickDto.getTotalClickCount() / 2,
			clickDto.getTotalClickCount(),
			clickDto.getRewardType().toString());
	}


	// 아이템 샀을 때
	public void buyItem() {
	}
}