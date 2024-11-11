package com.toudeuk.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

import com.toudeuk.configuration.ConnectionPool;
import com.toudeuk.dto.KafkaGameCashLogDto;
import com.toudeuk.enums.CashLogType;

public class ToudeukDao {

	private static ToudeukDao instance;

	private ToudeukDao() {}

	public static synchronized ToudeukDao getInstance() {
		if (instance == null) {
			instance = new ToudeukDao();
		}
		return instance;
	}

	public Connection startTransaction() throws SQLException {
		Connection conn = ConnectionPool.getConnection();
		conn.setAutoCommit(false);
		return conn;
	}

	public void commitTransaction(Connection conn) throws SQLException {
		conn.commit();
	}

	public void rollbackTransaction(Connection conn) throws SQLException {
		conn.rollback();
	}

	public void closeConnection(Connection conn) throws SQLException {
		if (conn != null) {
			conn.setAutoCommit(true);
			conn.close();
		}
	}

	public void insertClickLog(Connection conn, Long userId, Long gameId, int totalClickCount) throws SQLException {
		String sql = "INSERT INTO click_game_log (user_id, click_game_id, click_order, created_at) VALUES (?, ?, ?, ?)";
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setLong(1, userId);
			pstmt.setLong(2, gameId);
			pstmt.setInt(3, totalClickCount);
			pstmt.setObject(4, LocalDateTime.now());
			pstmt.executeUpdate();
		}
	}

	public void insertRewardLog(Connection conn, Long userId, Long gameId, int reward, int totalClickCount, String rewardType) throws SQLException {
		String sql = "INSERT INTO click_game_reward_log (user_id, click_game_id, reward, click_count, click_game_reward_type, created_at) VALUES (?, ?, ?, ?, ?, ?)";
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setLong(1, userId);
			pstmt.setLong(2, gameId);
			pstmt.setInt(3, reward);
			pstmt.setInt(4, totalClickCount);
			pstmt.setString(5, rewardType);
			pstmt.setObject(6, LocalDateTime.now());
			pstmt.executeUpdate();
		}
	}

	public void insertUserItem(Connection conn, Long userId, Long itemId) throws SQLException {
		String sql = "INSERT INTO user_items (user_id, item_id, is_used, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setLong(1, userId);
			pstmt.setLong(2, itemId);
			pstmt.setBoolean(3, false);

			pstmt.executeUpdate();
		}
	}

	public void insertCashLog(Connection conn, Long userId, int changeCash, int resultCash, String itemName, String cashLogType) throws SQLException {
		String sql = "INSERT INTO cash_log (user_id, change_cash, result_cash, cash_name, cash_log_type, created_at) VALUES (?, ?, ?, ?, ?, ?)";
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setLong(1, userId);
			pstmt.setInt(2, changeCash);
			pstmt.setInt(3, resultCash);
			pstmt.setString(4, itemName);
			pstmt.setString(5, cashLogType);
			pstmt.setObject(6, LocalDateTime.now());
			pstmt.executeUpdate();
		}
	}

	public void insertCashLogBatch(Connection conn, List<KafkaGameCashLogDto> gameCashLogs) throws SQLException {
		String sql = "INSERT INTO cash_log (user_id, change_cash, result_cash, cash_name, cash_log_type, created_at) VALUES (?, ?, ?, ?, ?, ?)";
		try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
			int count = 0;
			for (KafkaGameCashLogDto gameCashLog : gameCashLogs) {
				pstmt.setLong(1, gameCashLog.getUserId());
				pstmt.setInt(2, gameCashLog.getChangeCash());
				pstmt.setInt(3, gameCashLog.getResultCash());
				pstmt.setString(4, "게임 " + gameCashLog.getGameId() + "회차");
				pstmt.setString(5, CashLogType.GAME.toString());
				pstmt.setObject(6, LocalDateTime.now());
				pstmt.addBatch();
				count++;

				if (count % 1000 == 0) {
					pstmt.executeBatch();
					pstmt.clearBatch();
				}
			}

			// 남은 배치 처리
			if (count % 1000 != 0) {
				pstmt.executeBatch();
			}
		}
	}

}