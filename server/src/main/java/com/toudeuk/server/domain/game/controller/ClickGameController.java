package com.toudeuk.server.domain.game.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.game.dto.GameData;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.service.ClickGameService;
import com.toudeuk.server.domain.user.service.JWTService;
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
	private final JWTService jwtService;
	private final SimpMessagingTemplate messagingTemplate;

	/**
	 * 사용자 클릭
	 * @param userId
	 * @return {@link SuccessResponse<GameData.DisplayInfoForClicker>}
	 */
	@PostMapping(value = "/click")
	@Operation(summary = "클릭", description = "버튼을 클릭합니다.")
	public SuccessResponse<GameData.DisplayInfoForClicker> click(@CurrentUser Long userId) throws
		JsonProcessingException {
		return SuccessResponse.of(clickGameService.click(userId));
	}

	/**
	 * 게임 시작
	 * @return {@link SuccessResponse <Void>}
	 */
	@PostMapping(value = "/start")
	@Operation(summary = "게임 시작", description = "게임을 시작합니다.")
	public SuccessResponse<Void> startGame(@CurrentUser Long userId) {
		log.info("게임 시작 컨트롤러");
		clickGameService.startGame(userId);
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
	public SuccessResponse<PagedModel<HistoryData.AllInfo>> getHistory(@CurrentUser Long userId,
		Pageable pageable) {
		return SuccessResponse.of(new PagedModel<>(clickGameService.getAllHistory(pageable)));
	}

	/**
	 * 게임 상세 보상 정보
	 *
	 * @param userId, gameId
	 */
	@GetMapping("/history/{gameId}/reward")
	@Operation(summary = "게임 상세 보상 정보", description = "게임 상세 보상 정보")
	public SuccessResponse<HistoryData.RewardInfo> getHistoryReward(@CurrentUser Long userId,
		@PathVariable Long gameId) {
		return SuccessResponse.of(clickGameService.getHistoryReward(gameId));
	}

	/**
	 * 현재 게임 보상 정보
	 * @param userId
	 * @return
	 */
	@GetMapping("/recent/reward")
	@Operation(summary = "현재 게임 상세 보상 정보", description = "현재 게임 상세 보상 정보")
	public SuccessResponse<HistoryData.RewardInfo> getHistoryReward(@CurrentUser Long userId) {
		return SuccessResponse.of(clickGameService.getRecentHistoryReward());
	}


	/**
	 * 게임 상세 정보 조회
	 *
	 * @param userId, gameId
	 */
	@GetMapping("/history/{gameId}")
	@Operation(summary = "게임 상세 정보 조회", description = "게임 상세 정보를 조회합니다.")
	public SuccessResponse<PagedModel<HistoryData.DetailLog>> getHistoryDetail(@CurrentUser Long userId,
		@PathVariable Long gameId,
		Pageable pageable) {
		return SuccessResponse.of(new PagedModel<>(clickGameService.getHistoryDetail(gameId, pageable)));
	}

	// ! Deprecated - 랭킹페이지
	/**!
	 * 게임 랭킹 조회
	 *
	 * @param userId, gameId
	 * @return {@link SuccessResponse <List<Map<String, Object>>>}
	 */
	//	@GetMapping("/rank")
	//	@Operation(summary = "게임 랭킹 조회", description = "게임 랭킹을 조회합니다.")
	//	public SuccessResponse<RankData.Result> getRanK(@CurrentUser Long userId) {
	//		return SuccessResponse.of(clickGameService.getRankingList());
	//	}

	/**
	 * 유저 게임 정보 조회
	 *
	 * @param bearerToken
	 *
	 * @return {@link SuccessResponse <Void>}
	 */
	// @GetMapping("/history/{userId}")
	// @Operation(summary = "유저 게임 정보 조회", description = "유저 게임 정보를 조회합니다.")
	// public SuccessResponse<Page<HistoryData.UserGameInfo>> getUserGameInfo(@CurrentUser Long userId,
	// 	Pageable pageable) {
	// 	return SuccessResponse.of(clickGameService.getUserGameInfo(userId, pageable));
	// }
}
