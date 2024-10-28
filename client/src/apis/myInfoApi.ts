import { BaseResponse } from "@/types/Base";
import { UserGifticonInfo } from "@/types/gifticon";
import { UserInfo } from "@/types/mypageInfo";
import instance from "./clientApi";

// export const fetchUserInfo = async (): Promise<UserInfo> => {
//   const response = await instance.get<BaseResponse<UserInfo>>("/user/info");
//   const data = response.data;
//   if (!data.success) throw new Error(response.data.message);
//   if (!data.data) {
//     throw new Error("유저 정보가 없습니다.");
//   }
//   return data.data;
// };
export const fetchUserInfo = async (): Promise<UserInfo> => {
  const response = await fetch("http://localhost:3000/api/v1/user/info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  // if (!data.success) throw new Error(response.data.message);
  // if (!data.data) {
  //   throw new Error("유저 정보가 없습니다.");
  // }
  return data;
};

export const fetchUserGifticons = async (): Promise<UserGifticonInfo[]> => {
  const response = await instance.get<BaseResponse<UserGifticonInfo[]>>(
    "/user/items"
  );
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  // 데이터를 최신순으로 정렬한 후, 최대 10개까지만 반환
  return (
    response.data.data
      ?.sort((a, b) => b.userItemId - a.userItemId) // 최신순 정렬
      .slice(0, 10) || [] // 최대 10개 반환
  );
};
