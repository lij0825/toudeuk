package com.toudeuk.server.domain.item.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.item.dto.ItemData;
import com.toudeuk.server.domain.item.service.ItemService;
import com.toudeuk.server.domain.user.entity.User;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
	 * @param user
	 * @return {@link SuccessResponse<List<ItemData.ItemInfo>}
	 */
	@GetMapping(value = "/list")
	@Operation(summary = "전체 아이템 정보 조회", description = "전체 아이템 정보를 조회합니다.")
	public SuccessResponse<List<ItemData.ItemInfo>> getItemList(@CurrentUser User user) {
		return SuccessResponse.of(itemService.getItemList());
	}

	/**
	 * 아이템 구매
	 *
	 * @param user, itemId
	 * @return {@link SuccessResponse<Void>}
	 */
	@PostMapping(value = "/buy")
	@Operation(summary = "아이템 구매", description = "아이템을 구매합니다.")
	@Parameter(name = "itemId", description = "아이템 ID", required = true)
	public SuccessResponse<Void> buyItem(@CurrentUser User user, @RequestBody ItemData.Buy buy) {
		itemService.buyItem(user.getId(), buy.getItemId());
		return SuccessResponse.empty();
	}

}
