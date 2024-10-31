export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface Pageable {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
  unpaged: boolean;
}

export enum RewardType {
  MAX_CLICKER = "MAX_CLICKER",
  WINNER = "WINNER",
  SECTION = "SECTION",
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

export interface GameUserInfo {
  nickname: string;
  profileImg: string;
  clickCount: number;
  rewardType: RewardType;
}

export interface CommonFields {
  createdAt: string;
  id: number;
  round: number;
}

//전체 게임 내역 정보
export interface ContentInfo {
  clickGameId: number;
  round: number;
  createdAt: string;
  winner: WinnerInfo;
  maxClicker: GameUserInfo;
  commonFields: CommonFields;
}

//전체 게임 내역 조회
export interface HistoriesInfo {
  totalPages: number;
  totalElements: number;
  pageabel: Pageable;
  size: number;
  content: ContentInfo[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

//개별 게임 상세 정보
export interface DetailContentInfo {
  clickGameId: number;
  round: number;
  createdAt: string;
  winner: WinnerInfo;
  maxClicker: MaxClickerInfo;
  middleRewardUsers: GameUserInfo[];
  allUsers: GameUserInfo[];
  commonFields: CommonFields;
}

// 개별 게임 정보 조회
export interface HistoryDetailInfo {
  totalPages: number;
  totalElements: number;
  pageabel: Pageable;
  size: number;
  content: DetailContentInfo[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
