import { BaseResponse } from "@/types/Base";
import { PrizeInfo } from "@/types";
import instance from "./clientApi";

interface PrizeParams {
  page: number;
  size: number;
  sort?: string;
}

//당첨, 승리내역 전체 목록 가져오기
export const fetchPrizes = async (
  params: PrizeParams
): Promise<PrizeInfo[]> => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== ""
    )
  );

  const response = await instance.get<BaseResponse<PrizeInfo[]>>(
    "/game/userprizes",
    { params: filteredParams }
  );
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  if (!response.data.data) {
    throw new Error(response.data.message);
  }
  return response.data.data || [];
};
