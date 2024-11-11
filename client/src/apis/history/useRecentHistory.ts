import { BaseResponse } from "@/types/Base";
import { HistoriesInfo, HistoryDetailInfo } from "@/types/history";
import instance from "../clientApi";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "react-toastify";

// 히스토리 최신 목록 가져오기(가장 마지막, 10개)
const fetchRecentHistories = async (): Promise<HistoriesInfo> => {
  const response = await instance.get<BaseResponse<HistoriesInfo>>(
    `/game/history?page=0&size=10&sort=Id,desc`
  );

  const data = response.data;

  console.log("API Response Data:", response.data);

  // 요청 실패일때
  if (!data.success || !data) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }
  return data.data as HistoriesInfo;
};

const useGetRecentHistories = () => {
  return useQuery({
    queryKey: ["recentHistory"],
    queryFn: () => fetchRecentHistories(),
  });
};
export default useGetRecentHistories;
