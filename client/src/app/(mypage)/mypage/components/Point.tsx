"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/apis/myInfoApi";
import { UserInfo } from "@/types/mypageInfo";
import { toast } from "react-toastify";

export default function Point() {
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserInfo>({
    queryKey: ["point"], // 캐싱 키 설정
    queryFn: fetchUserInfo,
    refetchOnWindowFocus: true, //페이지에 focus시 데이터 새로고침
  });

  // 로딩 중일 때
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 Toastify로 에러 메시지 표시
  if (isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  // 데이터가 없는 경우 (안전하게 userInfo 존재 여부 확인)
  if (!userInfo) {
    return <div>0</div>;
  }

  return (
    <div className="typo-sub-title">
      <p className="text-[#ffffffcc] text-sm mb-4">{userInfo.cash}</p>
    </div>
  );
}
