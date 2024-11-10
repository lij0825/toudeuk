import { BaseResponse } from "@/types/Base";
import { UserGifticonInfo, UserGifticonDetailInfo } from "@/types/gifticon";
import instance from "../clientApi";

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
