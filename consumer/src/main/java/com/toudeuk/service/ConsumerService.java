package com.toudeuk.service;

import com.toudeuk.dao.ToudeukDao;
import com.toudeuk.dto.ClickDto;
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
	public void click(ClickDto clickDto) {

		System.out.println(clickDto);

		// 게임 로그 저장
		toudeukDao.insertClickLog(
			clickDto.getUserId(),
			clickDto.getGameId(),
			clickDto.getTotalClickCount()
		);


		int reward = clickDto.getTotalClickCount() / 2;

		switch (getRewardType(clickDto.getTotalClickCount())) {

			// 첫번째 클릭이면
			case FIRST:
				toudeukDao.insertRewardLog(
					clickDto.getUserId(),
					clickDto.getGameId(),
					500,
					clickDto.getTotalClickCount(),
					RewardType.FIRST.toString()
				);
				break;

			// 마지막 클릭이면
			case WINNER:
				toudeukDao.insertRewardLog(
					clickDto.getUserId(),
					clickDto.getGameId(),
					reward,
					clickDto.getTotalClickCount(),
					RewardType.WINNER.toString()
				);
				break;

			// 중간 보상이면
			case SECTION:
				toudeukDao.insertRewardLog(
					clickDto.getUserId(),
					clickDto.getGameId(),
					reward,
					clickDto.getTotalClickCount(),
					RewardType.SECTION.toString()
				);
				break;
		}
	}

	// 아이템 샀을 때
	public void buyItem() {

	}

	// 캐시 충전 했을 때

	//

	public RewardType getRewardType(int totalClickCount) {

		if (totalClickCount == 1) {
			return RewardType.FIRST;
		}

		if (totalClickCount == 1000) {
			return RewardType.WINNER
		}

		if (totalClickCount % 100 == 0) {
			return RewardType.SECTION;
		}

		return null;
	}
}