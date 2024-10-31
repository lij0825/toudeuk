import { GifticonInfo } from "@/types/gifticon";
import instance from "./clientApi";
import { BaseResponse } from "@/types/Base";

export const fetchGifticonList = async (): Promise<GifticonInfo[]> => {
  const response = await instance.get<BaseResponse<GifticonInfo[]>>("/item/list");
  if (!response.data.success) {
    throw new Error(response.data.message)
  }

  return response.data.data || [];
};

export const fetchGifticonDetail = async (
  id: string
): Promise<GifticonInfo> => {
  const response = await instance.get<BaseResponse<GifticonInfo>>(
    `/gifticon/${id}`
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
}

export const buyGifticon = async (id: string): Promise<GifticonInfo> => {
  const response = await instance.post<BaseResponse<GifticonInfo>>(`/item/buy`,
    { "itemId": id }
  )
  if (!response.data.success) {
    throw new Error(response.data.message)
  }
  if (!response.data.data) {
    throw new Error(response.data.message)
  }
  return response.data.data;
}

export const useGifticon = async (id: string): Promise<void> => {
  const response = await instance.post<BaseResponse<void>>(`/items/use`,
    { "userItemId": id }
  )
  if (!response.data.success) {
    throw new Error(response.data.message)
  }
  if (!response.data.data) {
    throw new Error(response.data.message)
  }
}
