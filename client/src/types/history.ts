// export interface Sort {
//   sorted: boolean;
//   empty: boolean;
//   unsorted: boolean;
// }

export interface Page {
  paged: boolean;
  number: number;
  totalElements: number;
  totalPages: number;
}

export enum RewardType {
  MAX_CLICKER = "MAX_CLICKER",
  WINNER = "WINNER",
  SECTION = "SECTION",
  FIRST = "FIRST",
  NON = "NONE",
}

export interface WinnerInfo {
  nickname: string;
  profileImg: string;
  clickCount: number;
  rewardType: RewardType.WINNER;
}

export interface MaxClickerInfo {
  nickname: string;
  profileImg: string;
  clickCount: number;
  rewardType: RewardType.MAX_CLICKER;
}

export interface FirstClickerInfo {
  nickname: string;
  profileImg: string;
  clickCount: number;
  rewardType: RewardType.FIRST;
}

export interface GameUserInfo {
  nickname: string;
  profileImg: string;
  clickCount: number;
  rewardType: RewardType;
}

//전체 게임 내역 정보
export interface ContentInfo {
  clickGameId: number;
  round: number;
  createdAt: string;
  winner?: WinnerInfo;
  maxClicker?: MaxClickerInfo;
}

//전체 게임 내역 조회
export interface HistoriesInfo {
  page: Page;
  content: ContentInfo[];
}

//개별 게임 상세 정보
export interface DetailContentInfo {
  clickGameId: number;
  nickname: string;
  profileImg: string;
  createdAt: string;
  clickOrder : number;
}

// 개별 게임 정보 조회
export interface HistoryDetailInfo {
  page: Page;
  content: DetailContentInfo[];
}


export interface HistoryRewardInfo {
  winner : WinnerInfo;
  maxClicker :MaxClickerInfo;
  middleRewardUsers : GameUserInfo[];
  firstClicker: FirstClickerInfo;
}