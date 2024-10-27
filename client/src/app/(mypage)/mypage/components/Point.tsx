"use client";

import { fetchUserInfo } from "@/apis/myInfoApi";
import { UserInfo } from "@/types/mypageInfo";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function Point() {
  const { data: userInfo, isError } = useQuery<UserInfo>({
    queryKey: ["point"], // 캐싱 키 설정
    queryFn: fetchUserInfo,
    refetchOnWindowFocus: true, //페이지에 focus시 데이터 새로고침
  });

  // 에러가 발생했을 때 Toastify로 에러 메시지 표시
  if (isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  return (
    <div className="typo-sub-title">
      <p className="text-[#ffffffcc]">{userInfo ? userInfo.cash : 0}pt</p>
    </div>
  );
}
