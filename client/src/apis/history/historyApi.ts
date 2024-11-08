import { BaseResponse } from "@/types/Base";
import { HistoriesInfo, HistoryDetailInfo } from "@/types/history";
import instance from "../clientApi";

interface HistoriesParams {
  page: number;
  size: number;
  sort?: string;
}

// 히스토리 전체 목록 가져오기
export const fetchHistories = async (
  params: HistoriesParams
): Promise<HistoriesInfo> => {
  //sort 정보 추가될것 대비
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== ""
    )
  );

  const response = await instance.get<BaseResponse<HistoriesInfo>>(
    "/game/history",
    { params: filteredParams }
  );
  const data = response.data;

  console.log("API Response Data:", response.data);
  if (!data.success) {
    throw new Error(response.data.message);
  }

  if (!data.data) {
    throw new Error(response.data.message);
  }
  return data.data || [];
};

// UseQueryResult<History[], AxiosError<ErrorResponse>, number>
// onError:(error)=>
//   console.error(error.response.data)
//  switch error:

// 게임당 상세 히스토리 전체 목록 가져오기
export const fetchHistoryDetailInfo = async (
  id: number,
  params: HistoriesParams
): Promise<HistoryDetailInfo> => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== ""
    )
  );

  const response = await instance.get<BaseResponse<HistoryDetailInfo>>(
    `/game/history/${id}`,
    { params: filteredParams }
  );
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  if (!response.data.data) {
    throw new Error(response.data.message);
  }

  return response.data.data || [];
};
