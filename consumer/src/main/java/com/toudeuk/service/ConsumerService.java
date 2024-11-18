package com.toudeuk.service;

import com.toudeuk.dao.ToudeukDao;
import com.toudeuk.dto.KafkaChargingDto;
import com.toudeuk.dto.KafkaClickDto;
import com.toudeuk.dto.KafkaGameCashLogDto;
import com.toudeuk.dto.KafkaItemBuyDto;
import com.toudeuk.enums.CashLogType;
import com.toudeuk.enums.RewardType;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@FunctionalInterface
interface TransactionCallback {
	void execute(Connection conn) throws SQLException;
}

public class ConsumerService {
	private static ConsumerService instance;

	private ConsumerService() {}

	public static synchronized ConsumerService getInstance() {
		if (instance == null) {
			instance = new ConsumerService();
		}
		return instance;
	}

	private final ToudeukDao toudeukDao = ToudeukDao.getInstance();

	// 클릭 했을 때
	public void click(KafkaClickDto clickDto) {
		executeInTransaction(conn -> {

			// 게임 로그 저장
			toudeukDao.insertClickLog(conn, clickDto.getUserId(), clickDto.getGameId(), clickDto.getTotalClickCount());

			// 보상 조건이 없으면 그냥 리턴
			if (clickDto.getRewardType().equals(RewardType.NONE)) {
				return;
			}

			// 첫번째 보상
			if (clickDto.getRewardType().equals(RewardType.FIRST)) {
				toudeukDao.insertRewardLog(conn, clickDto.getUserId(), clickDto.getGameId(), 500, clickDto.getTotalClickCount(), RewardType.FIRST.toString());
				toudeukDao.insertCashLog(conn, clickDto.getUserId(), 500, 0, "첫번째 보상", CashLogType.REWARD.toString());
			} else {
				// 나머지 보상 마지막 또는 중간중간 보상 어차피 계산값 동일
				toudeukDao.insertRewardLog(conn, clickDto.getUserId(), clickDto.getGameId(), clickDto.getTotalClickCount() / 2, clickDto.getTotalClickCount(), clickDto.getRewardType().toString());
				toudeukDao.insertCashLog(conn, clickDto.getUserId(), clickDto.getTotalClickCount() / 2, 0, "첫번째 보상", CashLogType.REWARD.toString());
			}
		});
	}

	// 아이템 샀을 때
	public void itemBuy(KafkaItemBuyDto itemBuyDto) {
		executeInTransaction(conn -> {
			// 유저 아이템 저장
			toudeukDao.insertUserItem(conn, itemBuyDto.getUserId(), itemBuyDto.getItemId());

			// 유저 캐시 로그 저장
			toudeukDao.insertCashLog(conn, itemBuyDto.getUserId(), itemBuyDto.getChangeCash(), itemBuyDto.getResultCash(), itemBuyDto.getItemName(), itemBuyDto.getCashLogType().toString());
		});
	}

	public void chargeCash(KafkaChargingDto chargingDto) {
		executeInTransaction(conn -> {
			// 유저 캐시 로그 저장
			toudeukDao.insertCashLog(conn, chargingDto.getUserId(), chargingDto.getTotalAmount(), chargingDto.getResultCash(), "충전", CashLogType.CHARGING.toString());
		});
	}

	// 게임 캐시 로그
	public void gameCashLog(List<KafkaGameCashLogDto> gameCashLogs) {
		executeInTransaction(conn -> {
			toudeukDao.insertCashLogBatch(conn, gameCashLogs);
		});
	}


	private void executeInTransaction(TransactionCallback callback) {
		Connection conn = null;
		try {
			conn = toudeukDao.startTransaction();
			callback.execute(conn);
			toudeukDao.commitTransaction(conn);
		} catch (SQLException e) {
			if (conn != null) {
				try {
					toudeukDao.rollbackTransaction(conn);
				} catch (SQLException ex) {
					ex.printStackTrace();
				}
			}
			e.printStackTrace();
		} finally {
			if (conn != null) {
				try {
					toudeukDao.closeConnection(conn);
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}


}