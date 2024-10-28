// import { RankInfo } from "@/types/rankInfo"

import { BaseResponse } from "@/types/Base"
import instance from "./clientApi"
import { RankInfo } from "@/types/rankInfo";

// export const fetchRank = async (): Promise<RankInfo[]> => {

//     const response = await instance.get<BaseResponse<RankInfo[]>>("/rank");
//     if (!response.data.success) {
//         throw new Error(response.data.message)
//     }

//     return response.data.data || [];
// }

export const fetchRank = async (): Promise<RankInfo[]> => {
    const response = await fetch('http://localhost:3000/api/v1/rank',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }); // 실제 API 엔드포인트 사용
    console.log(response)
    console.log(response.status)
    if (response.status !== 200) {
        throw new Error('Failed to fetch ranks');
    }
    const data = await response.json();
    console.log(data)

    return data;
};