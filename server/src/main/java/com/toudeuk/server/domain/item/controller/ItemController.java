package com.toudeuk.server.domain.item.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.item.dto.ItemData;
import com.toudeuk.server.domain.item.service.ItemService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/v1/item")
@RequiredArgsConstructor
public class ItemController {

	private final ItemService itemService;

	/**
	 * 전체 아이템 정보 조회
	 *
	 * @param userId
	 * @return {@link SuccessResponse<List<ItemData.ItemInfo>}
	 */
	@GetMapping(value = "/list")
	public SuccessResponse<List<ItemData.ItemInfo>> getItemList(@RequestParam Long userId) {
		// FIXME : CurrentUser 나오면 수정
		return SuccessResponse.of(itemService.getItemList());
	}

	/**
	 * 아이템 구매
	 *
	 * @param userId, itemId
	 * @return {@link SuccessResponse<Void>}
	 */
	@PostMapping(value = "/buy")
	public SuccessResponse<Void> buyItem(@RequestParam Long userId, @RequestParam Long itemId) {
		// FIXME : CurrentUser 나오면 수정
		itemService.buyItem(userId, itemId);
		return SuccessResponse.empty();
	}

}
