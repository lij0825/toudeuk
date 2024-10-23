import { PrizeInfo } from "@/types/prize";
import instance from "./clientApi";
import { BaseResponse } from "@/types/Base";

export const fetchPrizes = async (): Promise<PrizeInfo[]> => {
  const response = await instance.get<BaseResponse<PrizeInfo[]>>("/prize");
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data || [];
};
