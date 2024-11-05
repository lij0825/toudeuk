package com.toudeuk.server.domain.game.dto;

import lombok.Data;

import java.util.List;

public class RankData {

    @Data
    public static class Result {
        private Long gameId;
        private List<RankList> rankList;

        public static Result of(Long gameId, List<RankList> rankList) {
            Result result = new Result();
            result.gameId = gameId;
            result.rankList = rankList;
            return result;
        }
    }

    @Data
    public static class RankList {
        private Integer rank;
        private Long userId;
        private Integer clickCount;

        public static RankList of(Integer rank, Long userId, Integer clickCount) {
            RankList rankList = new RankList();
            rankList.rank = rank;
            rankList.userId = userId;
            rankList.clickCount = clickCount;
            return rankList;
        }
    }

}
