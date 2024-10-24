package com.toudeuk.server.domain.game.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.repository.ClickGameLogRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRepository;
import com.toudeuk.server.domain.game.repository.ClickGameRewardLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClickGameService {

	private final ClickGameRepository clickGameRepository;
	private final ClickGameLogRepository clickGameLogRepository;
	private final ClickGameRewardLogRepository clickGameRewardLogRepository;

	public Page<HistoryData.AllInfo> getAllHistory(Pageable pageable) {

		return clickGameRepository.findAllByOrderByIdDesc(pageable).map(
			clickGame -> HistoryData.AllInfo.of(
				clickGame,
				clickGameRewardLogRepository.findWinnerByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(WINNER_NOT_FOUND)
				),
				clickGameRewardLogRepository.findWinnerClickCountByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(WINNER_NOT_FOUND)
				),
				clickGameRewardLogRepository.findMaxClickerByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(MAX_CLICKER_NOT_FOUND)
				),
				clickGameRewardLogRepository.findMaxClickerClickCountByClickGameId(clickGame.getId()).orElseThrow(
					() -> new BaseException(MAX_CLICKER_NOT_FOUND)
				)
			)
		);

	}

	public Page<HistoryData.DetailInfo> getHistoryDetail(Long gameId, Pageable pageable) {

		clickGameRewardLogRepository.findWinnerByClickGameId(gameId).orElseThrow(
			() -> new BaseException(WINNER_NOT_FOUND)
		);

		clickGameRewardLogRepository.findWinnerClickCountByClickGameId(gameId).orElseThrow(
			() -> new BaseException(WINNER_NOT_FOUND)
		);

		clickGameRewardLogRepository.findMaxClickerByClickGameId(gameId).orElseThrow(
			() -> new BaseException(MAX_CLICKER_NOT_FOUND)
		);

		clickGameRewardLogRepository.findMaxClickerClickCountByClickGameId(gameId).orElseThrow(
			() -> new BaseException(MAX_CLICKER_NOT_FOUND)
		);

		// List<User> users = clickGameRewardLogRepository.findMiddleByClickGameId(gameId).orElseThrow(
		// 	() -> new BaseException(MIDDLE_NOT_FOUND)
		// );

		return null;
	}
}
