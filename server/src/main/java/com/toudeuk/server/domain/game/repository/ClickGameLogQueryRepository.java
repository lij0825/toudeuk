package com.toudeuk.server.domain.game.repository;

import java.util.List;
import java.util.Optional;

import com.toudeuk.server.domain.game.dto.HistoryData;

public interface ClickGameLogQueryRepository {
	Optional<List<HistoryData.RewardUser>> findAllUsersByGameId(Long clickGameId);
}
