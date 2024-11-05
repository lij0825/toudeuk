export interface RankInfo {
    rank: number;
    nickname: string;
    clickCount: number;
    profileImageUrl: string;
}

export interface RanksInfo {
    gameId: string;
    rankList: RankInfo[];
}