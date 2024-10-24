// import { RankInfo } from "@/types/rankInfo"

import { BaseResponse } from "@/types/Base"
import instance from "./clientApi"
import { RankInfo } from "@/types/rankInfo";

export const fetchRank = async (): Promise<RankInfo[]> => {

    const response = await instance.get<BaseResponse<RankInfo[]>>("/rank");
    if (!response.data.success) {
        throw new Error(response.data.message)
    }

    return response.data.data || [];
}

// export const fetchRank = async (): Promise<RankInfo[]> => {
//     const response = await fetch('http://localhost:8080/rank',{
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     }); // 실제 API 엔드포인트 사용
//     console.log(response)
//     if (!response.ok) {
//         throw new Error('Failed to fetch ranks');
//     }
//     return response.json();
// };