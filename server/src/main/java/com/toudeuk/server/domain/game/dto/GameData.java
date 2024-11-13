package com.toudeuk.server.domain.game.dto;

import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.toudeuk.server.domain.game.entity.RewardType;

import lombok.Data;

public class GameData {

	@Data
	public static class DisplayInfoForClicker {

		@JsonSerialize(using = LocalDateTimeSerializer.class)
		@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
		private LocalDateTime coolTime;
		private String status;
		private Integer myRank;
		private Integer myClickCount;
		private RewardType rewardType;

		public static DisplayInfoForClicker of(
			LocalDateTime coolTime,
			String status,
			Integer myRank,
			Integer myClickCount,
			RewardType rewardType) {
			DisplayInfoForClicker displayInfo = new DisplayInfoForClicker();
			displayInfo.coolTime = coolTime;
			displayInfo.status = status;
			displayInfo.myRank = myRank;
			displayInfo.myClickCount = myClickCount;
			displayInfo.rewardType = rewardType;
			return displayInfo;
		}

		public static DisplayInfoForClicker of(
			DisplayInfoForEvery displayInfoForEvery,
			Integer myRank,
			Integer myClickCount,
			RewardType rewardType) {
			DisplayInfoForClicker displayInfo = new DisplayInfoForClicker();
			displayInfo.coolTime = displayInfoForEvery.getCoolTime();
			displayInfo.status = displayInfoForEvery.getStatus();
			displayInfo.myRank = myRank;
			displayInfo.myClickCount = myClickCount;
			displayInfo.rewardType = rewardType;
			return displayInfo;
		}

		public static GameData.DisplayInfoForClicker getDisplayInfoForClickerAtRunning(
			GameData.DisplayInfoForEvery displayInfoEvery, Integer myRank, Integer myClickCount,
			RewardType rewardType) {
			return GameData.DisplayInfoForClicker.of(
				displayInfoEvery,
				myRank,
				myClickCount,
				rewardType
			);
		}

		public static GameData.DisplayInfoForClicker getDisplayInfoForClickerAtCoolTime(
			GameData.DisplayInfoForEvery displayInfoEvery) {
			return getDisplayInfoForClickerAtRunning(displayInfoEvery, 0, 0, NONE);
		}

	}

	@Data
	public static class DisplayInfoForEvery {

		@JsonSerialize(using = LocalDateTimeSerializer.class)
		@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
		private LocalDateTime coolTime;
		private String status;
		private Integer totalClick;
		private String latestClicker;
		private Long gameId;
		private List<RankData.UserScore> rank;

		public static GameData.DisplayInfoForEvery of(
			LocalDateTime coolTime,
			String status,
			Integer totalClick,
			String latestClicker,
			List<RankData.UserScore> rank,
			Long gameId
		) {
			GameData.DisplayInfoForEvery displayInfo = new GameData.DisplayInfoForEvery();
			displayInfo.coolTime = coolTime;
			displayInfo.status = status;
			displayInfo.latestClicker = latestClicker;
			displayInfo.totalClick = totalClick;
			displayInfo.gameId = gameId;
			displayInfo.rank = rank;
			return displayInfo;
		}

		public static GameData.DisplayInfoForEvery getDisplayInfoForEveryAtRunning(Integer totalClick,
			String latestClicker, List<RankData.UserScore> rankingList, Long gameId) {
			return GameData.DisplayInfoForEvery.of(
				null,
				GameStatus.RUNNING.toString(),
				totalClick,
				latestClicker,
				rankingList,
				gameId
			);
		}

		public static GameData.DisplayInfoForEvery getDisplayInfoEveryAtCoolTime(LocalDateTime gameCoolTime) {
			return GameData.DisplayInfoForEvery.of(
				gameCoolTime,
				GameStatus.COOLTIME.toString(),
				0,
				"NONE",
				new ArrayList<>(),
				0L
			);
		}

	}

	enum GameStatus {
		COOLTIME, RUNNING;
	}

}
