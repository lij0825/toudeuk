import { PrizeInfo, PrizeRequest } from "@/types";
import { BaseResponse } from "@/types/Base";
import instance from "./clientApi";

//당첨, 승리내역 전체 목록 가져오기
export const fetchPrizes = async (
  params: PrizeRequest
): Promise<Partial<BaseResponse<PrizeInfo[]>>> => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== ""
    )
  );

  const response = await instance.get<BaseResponse<PrizeInfo[]>>(
    "/game/userprizes",
    { params: filteredParams }
  );
  // 필요한 데이터만
  const { success, message, data, status } = response.data;

  //에러 메세지 message 반환

  if (!success) {
    console.log(`요청 실패, status ${status}, ${message}, ${success}`);
    return { success, message };
  }
  //정보 반환시 localtime으로 변환
  const prizes = data?.map((prize) => ({
    ...prize,
    date: new Date(prize.date).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));

  return { success, data: prizes, message };
};
