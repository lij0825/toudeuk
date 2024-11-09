package com.toudeuk.server.domain.item.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import java.awt.print.Pageable;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.toudeuk.server.core.kafka.Producer;
import com.toudeuk.server.core.kafka.dto.KafkaItemBuyDto;
import com.toudeuk.server.domain.game.dto.HistoryData;
import com.toudeuk.server.domain.game.entity.ClickGame;
import com.toudeuk.server.domain.game.repository.ClickGameCacheRepository;
import com.toudeuk.server.domain.user.dto.UserItemData;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.domain.item.dto.ItemData;
import com.toudeuk.server.domain.item.entity.Item;
import com.toudeuk.server.domain.item.repository.ItemRepository;
import com.toudeuk.server.domain.user.entity.CashLogType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.entity.UserItem;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import com.toudeuk.server.domain.user.repository.UserItemRepository;
import com.toudeuk.server.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ItemService {

	private final ApplicationEventPublisher applicationEventPublisher;
	private final ItemRepository itemRepository;
	private final UserItemRepository userItemRepository;
	private final UserRepository userRepository;
	private final ClickGameCacheRepository clickGameCacheRepository;
	private final Producer producer;


	public List<ItemData.ItemInfo> getItemList() {
		return itemRepository.findAll().stream()
			.map(ItemData.ItemInfo::of)
			.toList();
	}

	public ItemData.ItemInfo getItemDetail(Long itemId) {
		Item item = itemRepository.findById(itemId).orElseThrow(() -> new BaseException(ITEM_NOT_FOUND));
		return ItemData.ItemInfo.of(item);
	}



	public List<UserItemData.UserItemInfo> getUserItemList(Long userId) {
		List<UserItem> userItems = userItemRepository.findAllByUserId(userId)
				.orElseThrow(() -> new BaseException(USER_ITEM_NOT_FOUND));

		return userItems.stream()
				.map(UserItemData.UserItemInfo::of)
				.collect(Collectors.toList());
	}

	public UserItemData.UserItemDetail getUserItemDetail(Long userId, Long userItemId) {
		UserItem userItem = userItemRepository.findById(userItemId)
				.orElseThrow(() -> new BaseException(USER_ITEM_NOT_FOUND));

		return UserItemData.UserItemDetail.of(userItem);
	}

	@Transactional
	public void useItem(Long userId, Long userItemId) {
		UserItem userItem = userItemRepository.findById(userItemId)
				.orElseThrow(() -> new BaseException(USER_ITEM_NOT_FOUND));
		userItem.useItem();
	}


	@Transactional
	public void buyItem(Long userId, Long itemId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
		Item item = itemRepository.findById(itemId).orElseThrow(() -> new BaseException(ITEM_NOT_FOUND));
		Integer userCash = clickGameCacheRepository.getUserCash(userId);

		int changeCash = -item.getPrice();
		int resultCash = userCash - item.getPrice();

		if (resultCash < 0) {
			throw new BaseException(NOT_ENOUGH_CASH);
		}

		clickGameCacheRepository.updateUserCash(userId, changeCash);

		// 카프카 아이템 바이 DTO에 필용한거
		// 유저 ID, Item ID, changeCash, resultCash, item.getName(), CashLogType.ITEM

		KafkaItemBuyDto kafkaItemBuyDto = new KafkaItemBuyDto(userId, itemId, changeCash, resultCash, item.getName(),
			CashLogType.ITEM);

		// 카프카로 보내기
		producer.occurItemBuy(kafkaItemBuyDto);


		//! 이 부분들이 컨슈머에서 작업 되도록
		// UserItem userItem = UserItem.create(user, item);
		// userItemRepository.save(userItem);
		//
		// applicationEventPublisher.publishEvent(
		// 	new CashLogEvent(user, changeCash, resultCash, item.getName(), CashLogType.ITEM));
	}


	// 컨슘 된다
	@Transactional
	public void saveItemBuyData(KafkaItemBuyDto kafkaItemBuyDto) {
		User user = userRepository.findById(kafkaItemBuyDto.getUserId())
			.orElseThrow(() -> new BaseException(USER_NOT_FOUND));

		Item item = itemRepository.findById(kafkaItemBuyDto.getItemId())
			.orElseThrow(() -> new BaseException(ITEM_NOT_FOUND));

		UserItem userItem = UserItem.create(user, item);
		userItemRepository.save(userItem);

		//! 이벤트에서 resultCash 안먹음
		applicationEventPublisher.publishEvent(
			new CashLogEvent(user, kafkaItemBuyDto.getChangeCash(), kafkaItemBuyDto.getResultCash(), item.getName(),
				CashLogType.ITEM));
	}
}
