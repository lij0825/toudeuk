package com.toudeuk.server.domain.game.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.domain.game.dto.HistoryData;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/v1/game")
@RequiredArgsConstructor
@Tag(name = "게임", description = "게임 관련 API")
public class GameController {

	/**
	 * 모든 게임 정보 조회
	 * 몇 회차인지, 우승자, 시간
	 *
	 * @param userId
	 * @return Page<HistoryData.AllInfo>
	 */
	@GetMapping("/history")
	@Operation(summary = "모든 게임 정보 조회", description = "모든 게임 정보를 조회합니다.")
	public Page<HistoryData.AllInfo> getHistory(@CurrentUser Long userId) {
		return null;
	}

	/**
	 * 라운드 별 게임 정보 조회
	 */
}
