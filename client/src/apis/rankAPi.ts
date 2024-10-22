// import { RankInfo } from "@/types/rankInfo"

export const getRank = async () => {
    const response = await fetch('/api/rank',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok) {
        throw new Error('랭크 조회에 실패했습니다.');
    }
    return response.json();
}