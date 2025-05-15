package com.toudeuk.server.domain.item.controller;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import java.util.List;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.item.entity.Item;
import com.toudeuk.server.domain.item.repository.ItemRepository;
import com.toudeuk.server.domain.kapay.controller.KapayController;
import com.toudeuk.server.domain.kapay.dto.ReadyResponse;
import com.toudeuk.server.domain.user.dto.UserItemData;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.toudeuk.server.core.annotation.CurrentUser;
import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.item.dto.ItemData;
import com.toudeuk.server.domain.item.service.ItemService;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;
import com.toudeuk.server.domain.user.service.UserService;

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
	private final ItemRepository itemRepository;
	private final UserRepository userRepository;
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

	/**
	 * 아이템 현금 결제 준비
	 * @param userId
	 * @param agent
	 * @param openType
	 * @param itemId
	 * @return
	 */
	@PostMapping(value = "/buy/cash/{agent}/{openType}")
	 @Operation(summary = "아이템 현금 결제", description = "아이템을 현금으로 결제합니다.")
	 public SuccessResponse<String> buyItemCash(@CurrentUser Long userId,
	     @PathVariable String agent,
	     @PathVariable String openType,
	     @RequestParam("itemId") Long itemId) {

	     User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
	     Item item = itemRepository.findById(itemId).orElseThrow(() -> new BaseException(ITEM_NOT_FOUND));

	     // 아이템 정보로 결제 정보 생성
	     String itemName = item.getName();
	     Integer totalAmount = item.getPrice();

	     ReadyResponse readyResponse = itemService.buyItemCash(user, agent, openType, itemName, totalAmount, itemId);
	     String redirectUrl = KapayController.getRedirectUrl(agent, openType, readyResponse);

	     return SuccessResponse.of(redirectUrl);
	 }


}
