package com.toudeuk.server.domain.game.dto;

import com.toudeuk.server.domain.game.entity.ClickGame;
import lombok.Data;

public class GameData {

    @Data
    public static class DisplayInfo {
        private Integer myRank;
        private Integer myClickCount;
        private Long prevUserId;
        private Integer prevClickCount;
        private Integer totalClick;

        public static GameData.DisplayInfo of(
                Integer myRank,
                Integer myClickCount,
                Long prevUserId,
                Integer prevClickCount,
                Integer totalClick) {
            GameData.DisplayInfo displayInfo = new GameData.DisplayInfo();
            displayInfo.myRank = myRank;
            displayInfo.myClickCount = myClickCount;
            displayInfo.prevUserId = prevUserId;
            displayInfo.prevClickCount = prevClickCount;
            displayInfo.totalClick = totalClick;
            return displayInfo;
        }
    }
}
