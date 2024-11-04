package com.toudeuk.server.domain.game.dto;

import lombok.Data;

public class GameData {

    @Data
    public static class DisplayInfoForClicker {
        private Long coolTime;
        private String status;
        private Integer myRank;
        private Integer myClickCount;
        private Long prevUserId;
        private Integer prevClickCount;
        private Integer totalClick;

        public static DisplayInfoForClicker of(
                Long coolTime,
                String status,
                Integer myRank,
                Integer myClickCount,
                Long prevUserId,
                Integer prevClickCount,
                Integer totalClick) {
            DisplayInfoForClicker displayInfo = new DisplayInfoForClicker();
            displayInfo.coolTime = coolTime;
            displayInfo.status = status;
            displayInfo.myRank = myRank;
            displayInfo.myClickCount = myClickCount;
            displayInfo.prevUserId = prevUserId;
            displayInfo.prevClickCount = prevClickCount;
            displayInfo.totalClick = totalClick;
            return displayInfo;
        }

        public static DisplayInfoForClicker of(
                DisplayInfoForEvery displayInfoForEvery,
                Integer myRank,
                Integer myClickCount,
                Long prevUserId,
                Integer prevClickCount,
                Integer totalClick) {
            DisplayInfoForClicker displayInfo = new DisplayInfoForClicker();
            displayInfo.coolTime = displayInfoForEvery.getCoolTime();
            displayInfo.status = displayInfoForEvery.getStatus();
            displayInfo.myRank = myRank;
            displayInfo.myClickCount = myClickCount;
            displayInfo.prevUserId = prevUserId;
            displayInfo.prevClickCount = prevClickCount;
            displayInfo.totalClick = totalClick;
            return displayInfo;
        }
    }

    @Data
    public static class DisplayInfoForEvery {
        private Long coolTime;
        private String status;
        private Integer totalClick;

        public static GameData.DisplayInfoForEvery of(
                Long coolTime,
                String status,
                Integer totalClick) {
            GameData.DisplayInfoForEvery displayInfo = new GameData.DisplayInfoForEvery();
            displayInfo.coolTime = coolTime;
            displayInfo.status = status;
            displayInfo.totalClick = totalClick;
            return displayInfo;
        }
    }

}
