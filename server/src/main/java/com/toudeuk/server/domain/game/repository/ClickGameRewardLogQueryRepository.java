package com.toudeuk.server.domain.game.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;

import com.toudeuk.server.domain.game.dto.HistoryData;

import aj.org.objectweb.asm.commons.Remapper;

public interface ClickGameRewardLogQueryRepository {

	Optional<HistoryData.RewardUser> findWinnerByClickGameId(Long clickGameId);

	Optional<HistoryData.RewardUser> findMaxClickerByClickGameId(Long clickGameId);

	Optional<HistoryData.WinnerAndMaxClickerData> findWinnerAndMaxClickerByClickGameId(Long clickGameId);

	Optional<List<HistoryData.RewardUser>> findMiddleByClickGameId(Long clickGameId);
}
