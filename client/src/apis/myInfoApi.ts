import { UserInfo } from "@/types/mypageInfo";
import { UserGifticonInfo } from "@/types/gifticon";
import instance from "./clientApi";
import { BaseResponse } from "@/types/Base";

export const fetchUserInfo = async (): Promise<UserInfo> => {
  const response = await instance.get<BaseResponse<UserInfo>>("/user/info");
  const data = response.data;
  if (!data.success) throw new Error(response.data.message);
  if (!data.data) {
    throw new Error("유저 정보가 없습니다.");
  }
  return data.data;
};

export const fetchUserGifticons = async (): Promise<UserGifticonInfo[]> => {
  const response = await instance.get<BaseResponse<UserGifticonInfo[]>>(
    "/user/items"
  );
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data || [];
};
