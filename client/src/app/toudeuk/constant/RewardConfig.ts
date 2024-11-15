import { RewardType } from "@/types";

export interface RewardConfig {
  type: RewardType;
  title: string;
  description: string;
  duration: number;
  bgColor: string;
  borderColor: string;
  icon: string;
  scale: number; // 애니메이션 스케일 값 추가
}

export const REWARD_CONFIGS: Record<RewardType, RewardConfig> = {
  [RewardType.MAX_CLICKER]: {
    type: RewardType.MAX_CLICKER,
    title: "최다 클릭 달성!",
    description: "대단해요! 최다 클릭을 기록하셨습니다!",
    duration: 3000,
    bgColor: "bg-gradient-to-r from-red-500 via-rose-500 to-pink-500",
    borderColor: "border-red-300",
    icon: "🔥",
    scale: 1.1,
  },
  [RewardType.WINNER]: {
    type: RewardType.WINNER,
    title: "최종 승리!",
    description: "축하합니다! 최종 보상의 주인공이 되셨습니다!",
    duration: 5000,
    bgColor: "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500",
    borderColor: "border-yellow-300",
    icon: "🏆",
    scale: 1.2,
  },
  [RewardType.SECTION]: {
    type: RewardType.SECTION,
    title: "구간 보상 획득!",
    description: "축하합니다! 행운의 주인공이 되셨네요.",
    duration: 3000,
    bgColor: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
    borderColor: "border-blue-300",
    icon: "🎉",
    scale: 1.05,
  },
  [RewardType.FIRST]: {
    type: RewardType.FIRST,
    title: "첫 클릭 보상!",
    description: "축하합니다! 이번 게임의 첫 주인공이 되셨어요!",
    duration: 3000,
    bgColor: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500",
    borderColor: "border-emerald-300",
    icon: "⭐",
    scale: 1.05,
  },
  [RewardType.NON]: {
    type: RewardType.NON,
    title: "",
    description: "",
    duration: 0,
    bgColor: "",
    borderColor: "",
    icon: "",
    scale: 1,
  },
};
