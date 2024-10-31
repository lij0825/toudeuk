import { BaseResponse } from "@/types/Base";
import { HistoriesInfo, HistoryDetailInfo } from "@/types/history";
import instance from "./clientApi";

interface HistoriesParams {
  page: number;
  size: number;
  sort: string;
}

// 히스토리 전체 목록 가져오기
export const fetchHistories = async (
  params: HistoriesParams
): Promise<HistoriesInfo> => {
  const response = await instance.get<BaseResponse<HistoriesInfo>>(
    "/game/history",
    { params }
  );
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  if (!response.data.data) {
    throw new Error(response.data.message);
  }
  return response.data.data || [];
};

// 게임당 히스토리 전체 목록 가져오기
export const fetchHistoryDetailInfo = async (
  id: number,
  params: HistoriesParams
): Promise<HistoryDetailInfo[]> => {
  const response = await instance.get<BaseResponse<HistoryDetailInfo[]>>(
    `/game/history/${id}`,
    { params }
  );
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data || [];
};
