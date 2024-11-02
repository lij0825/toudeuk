"use client";

import { fetchUserGifticons } from "@/apis/gifticonApi";
import { UserGifticonInfo } from "@/types/gifticon";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

//[!FIX] suspense를 활용한 클라이언트 사이드 렌더링이 더 적합한가?
//서버에 데이터가 없을때 빈 화면을 어떻게 처리하는가?
//Serverside 렌더링시 미리 데이터를 가져오기/gesServerSideProps 는 컴포넌트 외부에서 선언해야함
//함수형으로 선언할 필요가 없음
export const getServerSideProps: GetServerSideProps = async () => {
  // 여기서 선언하는 클라이언트는 서버측의 클라이언트
  const queryClient = new QueryClient();

  // 서버에서 데이터를 미리 가져오기 (프리패칭)
  await queryClient.prefetchQuery({
    queryKey: ["usergifticons"], // 캐싱 키 설정
    queryFn: fetchUserGifticons,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient), // 데이터를 클라이언트로 전달[직렬화], pretechQuery값을 저장
    },
  };
};

export default function GifticonSwipe() {
  const { data: usergifticons = [], isError } = useQuery<UserGifticonInfo[]>({
    queryKey: ["usergifticons"], // 캐싱 키 설정
    queryFn: fetchUserGifticons,
  });

  // 에러가 발생했을 때 Toastify로 에러 메시지 표시
  if (isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  return (
    <div className="flex overflow-x-scroll overflow-y-hidden [&::-webkit-scrollbar]:hidden py-4">
      <Link href="/mygifticon" className="mr-3 ml-8">
        <div className="w-[150px] p-4 rounded-lg shadow-lg bg-secondary-2 font-noto text-xl common-link min-h-[150px]">
          <p>내 기프티콘</p>
          <p>보관함</p>
        </div>
      </Link>
      {usergifticons.map((gifticon: UserGifticonInfo, index: number) => (
        <Link
          key={gifticon.userItemId}
          href={`/mygifticon/${gifticon.userItemId}`}
          className={`p-4 rounded-lg backdrop-blur-lg bg-white/30 shadow-lg mr-3  common-link h-[150px]
          ${index === usergifticons.length - 1 ? "mr-8" : "mr-3"}`}
        >
          <div className="w-[100px] h-[100px] overflow-hidden">
            <Image
              src={gifticon.itemImage}
              alt={gifticon.itemName}
              width={100}
              height={100}
              className="rounded-sm object-cover w-full h-full"
            />
          </div>
          <div className="text-center mt-2 text-sm text-bold font-noto w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
            {gifticon.itemName}
          </div>
        </Link>
      ))}
    </div>
  );
}
