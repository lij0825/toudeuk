import { RewardType } from "./history";

export interface PrizeInfo {
  clickGameId: number;
  reward: number; // 당첨금
  rewardType: RewardType;
}
