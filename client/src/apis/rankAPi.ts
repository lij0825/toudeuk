import { BaseResponse } from "@/types/Base"
import instance from "./clientApi"
import { RankInfo, RanksInfo } from "@/types/rank";

export const fetchRank = async (): Promise<RanksInfo> => {

    const response = await instance.get<BaseResponse<RanksInfo>>("/game/rank");
    if (!response.data.success) {
        throw new Error(response.data.message)
    }

    return response.data.data || { gameId: "", rankList: [] };
}