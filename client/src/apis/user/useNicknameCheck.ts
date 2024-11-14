import { BaseResponse } from "@/types";
import instance from "../clientApi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export async function checkUserNickName(
  nickname: string
): Promise<BaseResponse<boolean>> {
  try {
    const response = await instance.get<BaseResponse<boolean>>(
      `user/nickname/check?nickname=${nickname}`
    );

    if (response.data.status !== 200) {
      throw new Error(
        response.data.message || "닉네임 중복 확인 중 오류가 발생했습니다."
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("닉네임 중복 확인 중 오류가 발생했습니다.");
  }
}

export function useNicknameCheck(nickname: string) {
  const {
    data: response,
    refetch,
    isLoading,
  } = useQuery<BaseResponse<boolean>>({
    queryKey: ["checkNickname", nickname],
    queryFn: () => checkUserNickName(nickname),
    enabled: false,
  });

  const checkNickname = async () => {
    try {
      const { data } = await refetch();
      if (data?.success) {
        toast[data.data ? "success" : "error"](
          data.data ? "사용 가능한 닉네임입니다" : "이미 사용 중인 닉네임입니다"
        );
      }
    } catch (error) {
      toast.error("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

  return {
    isValid: response?.data ?? false, // true일 때 사용 가능
    isChecked: response !== undefined,
    checkNickname,
    isLoading,
  };
}
