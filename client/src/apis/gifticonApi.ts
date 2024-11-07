import { BaseResponse } from "@/types/Base";
import {
  GifticonInfo,
  UserGifticonInfo,
  UserGifticonDetailInfo,
} from "@/types/gifticon";
import instance from "./clientApi";

export const fetchGifticonList = async (): Promise<GifticonInfo[]> => {
  const response = await instance.get<BaseResponse<GifticonInfo[]>>(
    "/item/list"
  );
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data || [];
};

//구매페이지
export const fetchGifticonDetail = async (
  id: string
): Promise<GifticonInfo> => {
  const response = await instance.get<BaseResponse<GifticonInfo>>(
    `/item/detail?itemId=${id}`
  );
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  if (!response.data.data) {
    throw new Error("기프티콘 데이터가 존재하지 않습니다.");
  }
  return response.data.data;

  // reponse.data.data가 항상 GifticonInfo 형식임을 보장할 때 사용
  // return response.data.data as GifticonInfo;
};

export const buyGifticon = async (id: string): Promise<void> => {
  const response = await instance.post<BaseResponse<void>>(`/item/buy`, {
    itemId: id,
  });
  console.log(response);
  if (!response.data.success || !response.data.data) {
    console.log("", response.data);
    throw new Error(response.data.message);
  }
  return response.data.data;
};

//기프티콘 사용처리
export const usedGifticon = async (id: string): Promise<void> => {
  const response = await instance.post<BaseResponse<void>>(`/user/items/use`, {
    userItemId: id,
  });
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  if (!response.data.data) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

//유저 기프티콘 정보 가져오기
export const fetchUserGifticons = async (): Promise<UserGifticonInfo[]> => {
  const response = await instance.get<BaseResponse<UserGifticonInfo[]>>(
    "/user/items"
  );
  if (!response.data.success) {
    throw new Error("기프티콘 정보를 불러오는데 실패했습니다.");
  }
  if (!response.data.data) {
    throw new Error("기프티콘 데이터가 존재하지 않습니다.");
  }
  return response.data.data;
};

//유저 기프티콘 상세 정보 가져오기
export const fetchUserGifticonDetail = async (
  id: string
): Promise<UserGifticonDetailInfo> => {
  const response = await instance.get<BaseResponse<UserGifticonDetailInfo>>(
    `/user/item/detail`,
    {
      params: {
        userItemId: id,
      },
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  if (!response.data.data) {
    throw new Error("기프티콘 데이터가 존재하지 않습니다.");
  }
  return response.data.data;
};
