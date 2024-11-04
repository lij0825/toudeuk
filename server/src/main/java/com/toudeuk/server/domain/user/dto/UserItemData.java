package com.toudeuk.server.domain.user.dto;

import com.toudeuk.server.domain.item.entity.Item;
import com.toudeuk.server.domain.item.entity.ItemType;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.entity.UserItem;
import lombok.Data;

public class UserItemData {
    @Data
    public static class UserItemInfo {
        private Long userItemId;
        private String itemName;
        private String itemImage;
        private boolean isUsed;
        private String createdAt;

        public static UserItemData.UserItemInfo of(UserItem userItem) {
            UserItemData.UserItemInfo userItemInfo = new UserItemData.UserItemInfo();
            userItemInfo.userItemId = userItem.getId();
            userItemInfo.itemName = userItem.getItem().getName();
            userItemInfo.itemImage = userItem.getItem().getImage();
            userItemInfo.isUsed = userItem.isUsed();
            userItemInfo.createdAt = userItem.getCreatedAt().toString();
            return userItemInfo;
        }

    }

    @Data
    public static class UserItemDetail {
        private Long userItemId;
        private String itemName;
        private String itemImage;
        private String itemBarcode;
        private ItemType itemType;
        private boolean isUsed;
        private String createdAt;


        public static UserItemData.UserItemDetail of(UserItem userItem) {
            UserItemData.UserItemDetail userItemDetail = new UserItemData.UserItemDetail();
            userItemDetail.userItemId = userItem.getId();
            userItemDetail.itemName = userItem.getItem().getName();
            userItemDetail.itemImage = userItem.getItem().getImage();
            userItemDetail.itemBarcode = userItem.getItem().getBarcode();
            userItemDetail.itemType = userItem.getItem().getItemType();
            userItemDetail.isUsed = userItem.isUsed();
            userItemDetail.createdAt = userItem.getCreatedAt().toString();
            return userItemDetail;
        }
    }

    @Data
    public static class Use {
        private Long userItemId;
    }



}
