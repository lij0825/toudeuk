package com.toudeuk.server.domain.item.dto;

import com.toudeuk.server.domain.item.entity.Item;

import com.toudeuk.server.domain.item.entity.ItemType;
import lombok.Data;

public class ItemData {

	@Data
	public static class ItemInfo {
		private Long itemId;
		private String itemName;
		private String itemImage;
		private int itemPrice;
		private ItemType itemType;

		public static ItemInfo of(Item item) {
			ItemInfo itemInfo = new ItemInfo();
			itemInfo.itemId = item.getId();
			itemInfo.itemName = item.getName();
			itemInfo.itemImage = item.getImage();
			itemInfo.itemPrice = item.getPrice();
			itemInfo.itemType = item.getItemType();
			return itemInfo;
		}
	}

	@Data
	public static class Buy {
		private Long itemId;
	}
}
