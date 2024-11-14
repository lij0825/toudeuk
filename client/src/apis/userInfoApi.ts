import { BaseResponse } from "@/types/Base";
import instance from "./clientApi";
import { UserInfo } from "@/types";

//사용자 정보 가져오기
export const fetchUserInfo = async (): Promise<UserInfo> => {
  const response = await instance.get<BaseResponse<UserInfo>>("/user/info");
  const data = response.data;
  if (!data.success) throw new Error(response.data.message);
  if (!data.data) {
    throw new Error("유저 정보가 없습니다.");
  }
  return data.data;
};

// 사용자 정보 업데이트
export const patchUserInfo = async (formData: FormData): Promise<void> => {
  const response = await instance.patch<BaseResponse<void>>("/user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const data = response.data;

  if (!data.success) throw new Error(data.message || "업데이트 실패");
  return data.data;
};
