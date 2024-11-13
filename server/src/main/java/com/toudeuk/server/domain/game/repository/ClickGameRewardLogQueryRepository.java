package com.toudeuk.server.domain.game.repository;

import java.util.List;
import java.util.Optional;

import com.toudeuk.server.domain.game.dto.HistoryData;

public interface ClickGameRewardLogQueryRepository {

	Optional<HistoryData.RewardUser> findWinnerByClickGameId(Long clickGameId);

	Optional<HistoryData.RewardUser> findMaxClickerByClickGameId(Long clickGameId);

	Optional<HistoryData.WinnerAndMaxClickerAndFirstClickerData> findWinnerAndMaxClickerByClickGameId(Long clickGameId);

	Optional<List<HistoryData.RewardUser>> findMiddleByClickGameId(Long clickGameId);
}
