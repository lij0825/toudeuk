package com.toudeuk.server.domain.game.repository;

import static com.toudeuk.server.domain.game.entity.QClickGameLog.*;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.toudeuk.server.domain.game.dto.HistoryData;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClickGameLogQueryRepositoryImpl implements ClickGameLogQueryRepository {
	private final JPAQueryFactory queryFactory;

	@Override
	public Optional<List<HistoryData.RewardUser>> findAllUsersByGameId(Long clickGameId) {
		return Optional.ofNullable(queryFactory
			.select(Projections.fields(
				HistoryData.RewardUser.class,
				clickGameLog.user.name.as("nickname"),
				clickGameLog.user.profileImg.as("profileImg"),
				clickGameLog.order.as("clickCount")
			))
			.from(clickGameLog)
			.where(clickGameLog.clickGame.id.eq(clickGameId))
			.fetch());
	}

}
