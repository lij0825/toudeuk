import { BaseResponse } from "@/types/Base";
import instance from "../clientApi";
import { UserInfo } from "@/types";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

//사용자 정보 가져오기
export const fetchUserInfo = async (): Promise<UserInfo> => {
  const response = await instance.get<BaseResponse<UserInfo>>("/user/info");
  const data = response.data;

  if (!data.data || !data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

const useGetUserInfo = (
  token: string | null
): UseQueryResult<UserInfo, Error> => {
  return useQuery<UserInfo, Error>({
    queryKey: ["user"],
    queryFn: () => fetchUserInfo(),
    staleTime: 5000, // 데이터가 신선한 상태로 유지되는 시간
    enabled: !!token,
  });
};
export default useGetUserInfo;
