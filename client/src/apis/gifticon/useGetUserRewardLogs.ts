import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BaseResponse } from "@/types/Base";
import { PrizeInfo } from "@/types";
import instance from "../clientApi";

// 유저 기프티콘 정보 가져오기 함수
const fetchUserRewardLogs = async (): Promise<PrizeInfo[]> => {
  const response = await instance.get<BaseResponse<PrizeInfo[]>>(
    "/user/reward-logs"
  );

  if (!response.data.success || !response.data.data) {
    toast.error(response.data.message);
    throw new Error();
  }

  return response.data.data;
};

// useUserRewardLogs
const useGetUserRewardLogs = () => {
  const query = useQuery<PrizeInfo[]>({
    queryKey: ["usergifticons"],
    queryFn: fetchUserRewardLogs,
  });

  // 쿼리 에러 처리
  if (query.isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  return query;
};

export default useGetUserRewardLogs;
