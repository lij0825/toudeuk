import { RewardType } from "./history";
export interface PrizeInfo {
  roundId: number; // 회차
  date: string; // 이벤트 일시
  point: number; // 당첨금
  participant: number; // 참가자 수
  clicks: number; // 클릭 횟수
  rewardType: RewardType;
}
