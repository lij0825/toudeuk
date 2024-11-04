import { BaseResponse } from "@/types/Base";
import instance from "./clientApi";
import { GameInfo } from "@/types/game";

export const gameClick = async (): Promise<GameInfo> => {
  const response = await instance.post<BaseResponse<GameInfo>>(`/game/click`);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  if (!response.data.data) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};
