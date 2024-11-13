package com.toudeuk.server.domain.game.repository;

import static com.toudeuk.server.domain.game.entity.QClickGameRewardLog.*;
import static com.toudeuk.server.domain.game.entity.RewardType.*;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.entity.RewardType;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClickGameRewardLogQueryRepositoryImpl implements ClickGameRewardLogQueryRepository {
	private final JPAQueryFactory queryFactory;

	@Override
	public Optional<HistoryData.RewardUser> findWinnerByClickGameId(Long clickGameId) {
		return getRewardUser(clickGameId, WINNER);
	}

	@Override
	public Optional<HistoryData.RewardUser> findMaxClickerByClickGameId(Long clickGameId) {
		return getRewardUser(clickGameId, MAX_CLICKER);
	}

	private Optional<HistoryData.RewardUser> getRewardUser(Long clickGameId, RewardType rewardType) {
		HistoryData.RewardUser rewardUser = queryFactory
			.select(Projections.fields(
				HistoryData.RewardUser.class,
				clickGameRewardLog.user.name.as("nickname"),
				clickGameRewardLog.user.profileImg.as("profileImg"),
				clickGameRewardLog.clickCount
			))
			.from(clickGameRewardLog)
			.where(clickGameRewardLog.clickGame.id.eq(clickGameId)
				.and(clickGameRewardLog.rewardType.eq(rewardType))
			)
			.fetchOne();

		return Optional.ofNullable(rewardUser);
	}

	@Override
	public Optional<HistoryData.WinnerAndMaxClickerAndFirstClickerData> findWinnerAndMaxClickerByClickGameId(
		Long clickGameId) {

		List<HistoryData.RewardUser> winnerAndMaxClickerAndFirstClicker = queryFactory
			.select(Projections.fields(
				HistoryData.RewardUser.class,
				clickGameRewardLog.user.name.as("nickname"),
				clickGameRewardLog.user.profileImg.as("profileImg"),
				clickGameRewardLog.clickCount.as("clickCount"),
				clickGameRewardLog.rewardType.as("rewardType") // rewardType 추가
			))
			.from(clickGameRewardLog)
			.where(clickGameRewardLog.clickGame.id.eq(clickGameId))
			.where(clickGameRewardLog.rewardType.eq(WINNER)
				.or(clickGameRewardLog.rewardType.eq(MAX_CLICKER))
				.or(clickGameRewardLog.rewardType.eq(FIRST))
			)
			.fetch();

		return Optional.of(HistoryData.WinnerAndMaxClickerAndFirstClickerData.of(
			winnerAndMaxClickerAndFirstClicker.stream()
				.filter(rewardUser -> rewardUser.getRewardType().equals(WINNER))
				.findFirst()
				.orElse(null),
			winnerAndMaxClickerAndFirstClicker.stream()
				.filter(rewardUser -> rewardUser.getRewardType().equals(MAX_CLICKER))
				.findFirst()
				.orElse(null),
			winnerAndMaxClickerAndFirstClicker.stream()
				.filter(rewardUser -> rewardUser.getRewardType().equals(FIRST))
				.findFirst()
				.orElse(null)
		));
	}

	@Override
	public Optional<List<HistoryData.RewardUser>> findMiddleByClickGameId(Long clickGameId) {
		return Optional.ofNullable(queryFactory
			.select(Projections.fields(
				HistoryData.RewardUser.class,
				clickGameRewardLog.user.name.as("nickname"),
				clickGameRewardLog.user.profileImg.as("profileImg"),
				clickGameRewardLog.clickCount.as("clickCount"),
				clickGameRewardLog.rewardType.as("rewardType")
			))
			.from(clickGameRewardLog)
			.where(clickGameRewardLog.clickGame.id.eq(clickGameId)
				.and(clickGameRewardLog.rewardType.eq(SECTION))
			)
			.fetch());
	}

}
