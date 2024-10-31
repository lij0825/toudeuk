package com.toudeuk.server.domain.item.service;

import static com.toudeuk.server.core.exception.ErrorCode.*;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
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

	public List<ItemData.ItemInfo> getItemList() {
		return itemRepository.findAll().stream()
			.map(ItemData.ItemInfo::of)
			.toList();
	}

	@Transactional
 	public void buyItem(Long userId, Long itemId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new BaseException(USER_NOT_FOUND));
		Item item = itemRepository.findById(itemId).orElseThrow(() -> new BaseException(ITEM_NOT_FOUND));

		UserItem userItem = UserItem.create(user, item);

		userItemRepository.save(userItem);

		int changeCash = -item.getPrice();
		int resultCash = user.getCash() - item.getPrice();

		applicationEventPublisher.publishEvent(
			new CashLogEvent(user, changeCash, resultCash, item.getName(), CashLogType.ITEM));

		user.updateCash(resultCash);
	}

}
