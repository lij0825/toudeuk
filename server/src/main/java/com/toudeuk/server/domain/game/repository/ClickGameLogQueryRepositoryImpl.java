package com.toudeuk.server.domain.game.repository;

import static com.toudeuk.server.domain.game.entity.QClickGameLog.*;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.toudeuk.server.domain.game.dto.HistoryData;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClickGameLogQueryRepositoryImpl implements ClickGameLogQueryRepository {
	private final JPAQueryFactory queryFactory;

}
