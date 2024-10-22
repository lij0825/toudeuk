// import { RankInfo } from "@/types/rankInfo"

import { BaseResponse } from "@/types/Base"
import instance from "./clientApi"
import { RankInfo } from "@/types/rankInfo";

export const getRank = async (): Promise<RankInfo[]> => {

    const response = await instance.get<BaseResponse<RankInfo[]>>("api/v1/rank");
    if (!response.data.success) {
        throw new Error(response.data.message)
    }

    return response.data.data || [];
}