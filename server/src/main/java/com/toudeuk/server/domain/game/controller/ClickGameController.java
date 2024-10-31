package com.toudeuk.server.domain.game.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.service.ClickGameService;
import com.toudeuk.server.domain.user.entity.User;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/v1/game")
@RequiredArgsConstructor
@Tag(name = "게임", description = "게임 관련 API")
public class ClickGameController {

	private final ClickGameService clickGameService;

	/**
	 * 사용자 클릭
	 * @param userId
	 * @return {@link SuccessResponse <Void>}
	 */
	@PostMapping(value = "/click")
	@Operation(summary = "클릭", description = "버튼을 클릭합니다.")
	public SuccessResponse<Void> click(@CurrentUser Long userId) {
		clickGameService.click(userId);
		return SuccessResponse.empty();
	}
	/**
	 * 게임 시작
	 * @return {@link SuccessResponse <Void>}
	 */
	@PostMapping(value = "/start")
	@Operation(summary = "게임 시작", description = "게임을 시작합니다.")
	public SuccessResponse<Void> startGame() {
		log.info("게임 시작 컨트롤러");
		clickGameService.startGame();
		return SuccessResponse.empty();
	}


	/**
	 * 모든 게임 정보 조회
	 * 몇 회차인지, 우승자, 시간
	 *
	 * @param userId, pageable
	 * @return Page<HistoryData.AllInfo>
	 */
	@GetMapping("/history")
	@Operation(summary = "모든 게임 정보 조회", description = "모든 게임 정보를 조회합니다.")
	public SuccessResponse<Page<HistoryData.AllInfo>> getHistory(@CurrentUser Long userId, Pageable pageable) {
		return SuccessResponse.of(clickGameService.getAllHistory(pageable));
	}

	/**
	 * 게임 상세 정보 조회
	 *
	 * @param userId, gameId
	 */
	@GetMapping("/history/{gameId}")
	@Operation(summary = "게임 상세 정보 조회", description = "게임 상세 정보를 조회합니다.")
	public SuccessResponse<Page<HistoryData.DetailInfo>> getHistoryDetail(@CurrentUser Long userId,
		@PathVariable Long gameId,
		Pageable pageable) {
		return SuccessResponse.of(clickGameService.getHistoryDetail(gameId, pageable));
	}
}
