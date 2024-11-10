import { BaseResponse } from "@/types/Base";
import { HistoriesInfo, HistoryDetailInfo } from "@/types/history";
import instance from "../clientApi";

interface HistoriesParams {
  page: number;
  size: number;
  sort?: string;
}

// 게임당 상세 히스토리 전체 목록 가져오기
export const fetchHistoryDetailInfo = async (
  id: number,
  params: HistoriesParams
): Promise<HistoryDetailInfo> => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== ""
    )
  );

  const response = await instance.get<BaseResponse<HistoryDetailInfo>>(
    `/game/history/${id}`,
    { params: filteredParams }
  );

  const data = response.data;
  if (!data.success) {
    throw new Error(response.data.message);
  }

  if (!data.data) {
    throw new Error(response.data.message);
  }

  return data.data || [];
};
