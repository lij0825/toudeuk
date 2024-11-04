package com.toudeuk.server.domain.user.dto;

import com.toudeuk.server.domain.item.entity.Item;
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

        public static UserItemData.UserItemInfo of(UserItem userItem) {
            UserItemData.UserItemInfo userItemInfo = new UserItemData.UserItemInfo();
            userItemInfo.userItemId = userItem.getId();
            userItemInfo.itemName = userItem.getItem().getName();
            userItemInfo.itemImage = userItem.getItem().getImage();
            userItemInfo.isUsed = userItem.isUsed();
            return userItemInfo;
        }
    }

    @Data
    public static class Use {
        private Long userItemId;
    }



}
