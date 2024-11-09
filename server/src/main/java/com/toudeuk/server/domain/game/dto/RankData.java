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
        private String nickname;
        private String profileImageUrl;
        private Integer clickCount;

        public static RankList of(Integer rank, String nickname, String profileImageUrl, Integer clickCount) {
            RankList rankList = new RankList();
            rankList.rank = rank;
            rankList.nickname = nickname;
            rankList.profileImageUrl = profileImageUrl;
            rankList.clickCount = clickCount;
            return rankList;
        }
    }

    @Data
    public static class UserScore{
        private String nickname;
        private Long score;

        public static UserScore of(String nickname, Long score) {
            UserScore userScore = new UserScore();
            userScore.nickname = nickname;
            userScore.score = score;
            return userScore;
        }
    }

}
