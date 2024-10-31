"use client";

import Link from "next/link";
import Image from "next/image";
import { UserGifticonInfo } from "@/types/gifticon";
import { GetServerSideProps } from "next";
import { fetchUserGifticons } from "@/apis/myInfoApi";
import { QueryClient, dehydrate } from "@tanstack/react-query";
// import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
// import { toast } from "react-toastify";

// 공통 스타일을 상수로 분리
export const CommonLinkStyle = {
  backgroundImage:
    "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
  backdropBlur: "lg",
  boxShadow: "lg",
  border: "solid 0.5px",
  borderRadius: "lg",
  alignItems: "center",
  height: "150px",
};

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

const usergifticons: UserGifticonInfo[] = [
  {
    userItemId: 1,
    itemName: "Coffee Coupon",
    itemImage:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    itemPrice: 4500,
    createdAt: "2024-10-10",
    used: true,
  },
  {
    userItemId: 2,
    itemName: "Pizza Gift Card",
    itemImage:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    itemPrice: 25000,
    createdAt: "2024-09-28",
    used: false,
  },
];

export default function GifticonSwipe() {
  // const { data: usergifticons = [], isError } = useQuery<UserGifticonInfo[]>({
  //   queryKey: ["user"], // 캐싱 키 설정
  //   queryFn: fetchUserGifticons,
  // });

  // // 에러가 발생했을 때 Toastify로 에러 메시지 표시
  // if (isError) {
  //   toast.error("유저정보를 다시 불러와주세요");
  // }

  return (
    <>
      <div className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        <Link
          href={`/mygifticon`}
          className="typo-sub-title p-4 border  rounded-lg backdrop-blur-lg bg-white/30 shadow-lg mr-3 "
          style={CommonLinkStyle}
        >
          <div className="w-[210px]">
            <div>My</div>
            <div>{`Gifticon >>`}</div>
          </div>
        </Link>
        {usergifticons.map((gifticon: UserGifticonInfo) => (
          <Link
            key={gifticon.userItemId}
            href={`/mygifticon/${gifticon.userItemId}`}
            className="p-4 border rounded-lg backdrop-blur-lg bg-white/30 shadow-lg flex-shrink-0 mr-3"
            style={CommonLinkStyle}
          >
            <div className="w-[160px]">
              <Image
                src={gifticon.itemImage}
                alt={gifticon.itemName}
                width={100}
                height={100}
                className="rounded-md"
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
