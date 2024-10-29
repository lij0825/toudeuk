import { LoginInfo, SignupInfo } from "@/types/auth";
import { BaseResponse } from "@/types/Base";
// import { UserInfo } from "@/types/mypageInfo";
import instance from "./clientApi";

export const signupUser = async (data: SignupInfo): Promise<void> => {
  // promise 걸어주는게 좋습니다
  // 엔드 포인트 주소는 바뀔 수 있습니다
  // BaseResponse 로 응답 형식 맞춰서 드릴께요
  const response = await instance.post<BaseResponse<null>>("/auth/sign", data);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
};

export const loginUser = async (
  data: LoginInfo
): Promise<BaseResponse<null>> => {
  const response = await instance.post<BaseResponse<null>>("/auth/login", data);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data;
};


// export const signupUser = async (data: UserInfo) => {
//   const response = await fetch("/api/signup", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error("회원가입에 실패했습니다.");
//   }
//   return response.json();
// };

// export const loginUser = async (data: LoginInfo) => {
//   const response = await fetch("/api/login", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error("로그인에 실패했습니다.");
//   }
//   return response.json();
// };
