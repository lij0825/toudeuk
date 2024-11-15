import { BaseResponse } from "@/types/Base";
import { HistoryRewardInfo, HistoryDetailInfo } from "@/types/history";
import instance from "../clientApi";

//게임 당 보상 내역
export const fetchGameRewardHistory = async (
  id: number
): Promise<HistoryRewardInfo> => {
  const response = await instance.get<BaseResponse<HistoryRewardInfo>>(
    `/game/history/${id}/reward`
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



//최근 게임 보상 내역
export const fetchGameRecentReward = async (
): Promise<HistoryRewardInfo> => {
  const response = await instance.get<BaseResponse<HistoryRewardInfo>>(
    `/game/recent/reward`
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
