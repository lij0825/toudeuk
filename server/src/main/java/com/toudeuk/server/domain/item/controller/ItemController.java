package com.toudeuk.server.domain.item.controller;

import java.util.List;

import com.toudeuk.server.domain.user.dto.UserItemData;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.item.dto.ItemData;
import com.toudeuk.server.domain.item.service.ItemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/v1/item")
@RequiredArgsConstructor
@Tag(name = "아이템", description = "아이템 관련 API")
public class ItemController {

	private final ItemService itemService;

	/**
	 * 전체 아이템 정보 조회
	 *
	 * @param userId
	 * @return {@link SuccessResponse<List<ItemData.ItemInfo>}
	 */
	@GetMapping(value = "/list")
	@Operation(summary = "전체 아이템 정보 조회", description = "전체 아이템 정보를 조회합니다.")
	public SuccessResponse<List<ItemData.ItemInfo>> getItemList(@CurrentUser Long userId) {
		return SuccessResponse.of(itemService.getItemList());
	}

	/**
	 * 아이템 상세 조회
	 *
	 * @param userId, itemId
	 * @return {@link SuccessResponse<ItemData.ItemInfo>}
	 */
	@GetMapping(value = "/detail")
	@Operation(summary = "아이템 상세 조회", description = "아이템 상세 정보를 조회합니다.")
	public SuccessResponse<ItemData.ItemInfo> getItemDetail(@CurrentUser Long userId, @RequestParam Long itemId) {
		return SuccessResponse.of(itemService.getItemDetail(itemId));
	}

	/**
	 * 아이템 구매
	 *
	 * @param userId, itemId
	 * @return {@link SuccessResponse<Void>}
	 */
	@PostMapping(value = "/buy")
	@Operation(summary = "아이템 구매", description = "아이템을 구매합니다.")
	public SuccessResponse<Void> buyItem(@CurrentUser Long userId, @RequestBody ItemData.Buy buy) {
		itemService.buyItem(userId, buy.getItemId());
		return SuccessResponse.empty();
	}

}
