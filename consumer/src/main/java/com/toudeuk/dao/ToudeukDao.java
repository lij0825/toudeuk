package com.toudeuk.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;

import com.toudeuk.configuration.ConnectionPool;

public class ToudeukDao {

	private static ToudeukDao instance;

	private ToudeukDao() {

	}

	public static synchronized ToudeukDao getInstance() {
		if (instance == null) {
			instance = new ToudeukDao();
		}
		return instance;
	}

	public void insertClickLog(Long userId, Long gameId, int totalClickCount) {
		String sql = """
			INSERT INTO click_game_log (user_id, click_game_id, click_order, created_at) 
			VALUES (?, ?, ?, ?)
			""";

		try (Connection conn = ConnectionPool.getConnection();
			 PreparedStatement pstmt = conn.prepareStatement(sql)) {

			pstmt.setLong(1, userId);
			pstmt.setLong(2, gameId);
			pstmt.setInt(3, totalClickCount);
			pstmt.setObject(4, LocalDateTime.now());

			pstmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void insertRewardLog(Long userId, Long gameId, int reward, int totalClickCount, String string) {
		String sql = """
			INSERT INTO click_game_reward_log (user_id, click_game_id, reward, click_count, click_game_reward_type, created_at) 
			VALUES (?, ?, ?, ?, ?, ?)
			""";

		try (Connection conn = ConnectionPool.getConnection();
			 PreparedStatement pstmt = conn.prepareStatement(sql)) {

			pstmt.setLong(1, userId);
			pstmt.setLong(2, gameId);
			pstmt.setInt(3, reward);
			pstmt.setInt(4, totalClickCount);
			pstmt.setString(5, string);
			pstmt.setObject(6, LocalDateTime.now());

			pstmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}


	}


	//
	//
	// public void insertToudeuk(ToudeukDto dto) throws SQLException {
	// 	String sql = "INSERT INTO toudeuk (field1, field2, field3) VALUES (?, ?, ?)";
	//
	//
	// 	try (Connection conn = ConnectionPool.getConnection();
	// 		 PreparedStatement pstmt = conn.prepareStatement(sql)) {
	//
	// 		pstmt.setString(1, dto.getField1());
	// 		pstmt.setInt(2, dto.getField2());
	// 		pstmt.setBoolean(3, dto.isField3());
	//
	// 		pstmt.executeUpdate();
	// 	}
	// }
	//
	//
	// public void updateToudeuk(ToudeukDto dto) throws SQLException {
	// 	String sql = "UPDATE toudeuk SET field1 = ?, field2 = ?, field3 = ? WHERE id = ?";
	//
	// 	try (Connection conn = ConnectionPool.getConnection();
	// 		 PreparedStatement pstmt = conn.prepareStatement(sql)) {
	//
	// 		pstmt.setString(1, dto.getField1());
	// 		pstmt.setInt(2, dto.getField2());
	// 		pstmt.setBoolean(3, dto.isField3());
	// 		pstmt.setLong(4, dto.getId());
	//
	// 		pstmt.executeUpdate();
	// 	}
	// }
}