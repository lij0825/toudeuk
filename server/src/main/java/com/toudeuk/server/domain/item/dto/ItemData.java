package com.toudeuk.server.domain.item.dto;

import com.toudeuk.server.domain.item.entity.Item;

import lombok.Data;

public class ItemData {

	@Data
	public static class ItemInfo {
		private String itemName;
		private String itemImage;
		private int itemPrice;

		public static ItemInfo of(Item item) {
			ItemInfo itemInfo = new ItemInfo();
			itemInfo.itemName = item.getName();
			itemInfo.itemImage = item.getImage();
			itemInfo.itemPrice = item.getPrice();
			return itemInfo;
		}
	}
}
