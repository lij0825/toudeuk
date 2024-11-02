"use client";

import { fetchUserInfo } from "@/apis/userInfoApi";
import { UserInfo } from "@/types/mypageInfo";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import SettingButton from "./Setting";

//Serverside 렌더링시 미리 데이터를 가져오기/gesServerSideProps 는 컴포넌트 외부에서 선언해야함
//함수형으로 선언할 필요가 없음
export const getServerSideProps: GetServerSideProps = async () => {
  // 여기서 선언하는 클라이언트는 서버측의 클라이언트
  const queryClient = new QueryClient();

  // 서버에서 데이터를 미리 가져오기 (프리패칭)
  await queryClient.prefetchQuery({
    queryKey: ["user"], // 캐싱 키 설정
    queryFn: fetchUserInfo,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient), // 데이터를 클라이언트로 전달[직렬화], pretechQuery값을 저장
    },
  };
};

export default function UserInfoItem() {
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
      <section className="flex align-center pb-8 justify-between">
        <div className="flex items-cente">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-4">
            <Image
              src={userInfo?.profileImg || "/default_profile.jpg"}
              alt="Profile Image"
              layout="fill"
              objectFit="cover"
              sizes="48px"
            />
          </div>
          <span>{userInfo?.nickName}</span>
        </div>
        <SettingButton />
      </section>
      <>
        <Link href={"/point"}>
          <div className="bg-secondary p-5 rounded-xl text-white">
            {userInfo ? userInfo.cash : 0}pt
          </div>
        </Link>
      </>
    </div>
  );
}
