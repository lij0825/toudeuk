"use client";

import { fetchUserInfo } from "@/apis/myInfoApi";
import { UserInfo } from "@/types/mypageInfo";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";


//Serverside 렌더링시 미리 데이터를 가져오기/gesServerSideProps 는 컴포넌트 외부에서 선언해야함
//함수형으로 선언할 필요가 없음
export const getServerSideProps:GetServerSideProps = (async () => {
  // 여기서 선언하는 클라이언트는 서버측의 클라이언트
  const queryClient = new QueryClient();

  // 서버에서 데이터를 미리 가져오기 (프리패칭)
  await queryClient.prefetchQuery({
    queryKey: ["user"], // 캐싱 키 설정
    queryFn: fetchUserInfo
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient), // 데이터를 클라이언트로 전달[직렬화], pretechQuery값을 저장
    }
  }
}) 

export default function Point() {


  const { data: userInfo, isError } = useQuery<UserInfo>({
    queryKey: ["user"], // 캐싱 키 설정
    queryFn: fetchUserInfo,
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
