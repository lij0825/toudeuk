import { BaseResponse } from "@/types/Base";
import { HistoriesInfo } from "@/types/history";
import instance from "../clientApi";
import { useQuery } from "@tanstack/react-query";

// 히스토리 최신 목록 가져오기(가장 마지막, 10개)
const fetchRecentHistories = async (): Promise<HistoriesInfo> => {
  const response = await instance.get<BaseResponse<HistoriesInfo>>(
    `/game/history?page=0&size=10&sort=Id,desc`
  );

  const data = response.data;

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
    staleTime: 5000, // 데이터가 신선한 상태로 유지되는 시간
    refetchInterval: 180000, // 3분마다 자동으로 데이터 요청
  });
};
export default useGetRecentHistories;
