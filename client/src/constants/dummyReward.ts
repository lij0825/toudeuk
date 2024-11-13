import { HistoryRewardInfo } from "@/types";
import { RewardType } from "@/types";

interface EndGameProps {
  remainingTime: number; // 초 단위
  remainingMilliseconds: number; // 밀리초 단위
  reward: HistoryRewardInfo;
  gameId: number;
}

export const dummyData: EndGameProps = {
  remainingTime: 59, //초
  remainingMilliseconds: 0,
  reward: {
    winner: {
      nickname: "마지막클릭자",
      profileImg:
        "http://k.kakaocdn.net/dn/9U6yf/btsKsou0Ji7/iQZyb01muB77l7kDHorVyk/img_640x640.jpg",
      clickCount: 120,
      rewardType: RewardType.WINNER,
    },
    maxClicker: {
      nickname: "최고클릭자",
      profileImg:
        "http://k.kakaocdn.net/dn/9U6yf/btsKsou0Ji7/iQZyb01muB77l7kDHorVyk/img_640x640.jpg",
      clickCount: 200,
      rewardType: RewardType.MAX_CLICKER,
    },
    firstClicker: {
      nickname: "첫번째클릭자",
      profileImg:
        "http://k.kakaocdn.net/dn/9U6yf/btsKsou0Ji7/iQZyb01muB77l7kDHorVyk/img_640x640.jpg",
      clickCount: 1,
      rewardType: RewardType.FIRST,
    },
    middleRewardUsers: [
      {
        nickname: "중간보상자1",
        profileImg:
          "http://k.kakaocdn.net/dn/9U6yf/btsKsou0Ji7/iQZyb01muB77l7kDHorVyk/img_640x640.jpg",
        clickCount: 10,
        rewardType: RewardType.SECTION,
      },
      {
        nickname: "중간보상자2",
        profileImg:
          "http://k.kakaocdn.net/dn/9U6yf/btsKsou0Ji7/iQZyb01muB77l7kDHorVyk/img_640x640.jpg",
        clickCount: 20,
        rewardType: RewardType.SECTION,
      },
      {
        nickname: "중간보상자3",
        profileImg:
          "http://k.kakaocdn.net/dn/9U6yf/btsKsou0Ji7/iQZyb01muB77l7kDHorVyk/img_640x640.jpg",
        clickCount: 30,
        rewardType: RewardType.SECTION,
      },
    ],
  },
  gameId: 1,
};
