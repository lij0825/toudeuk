"use client";

import { fetchUserGifticons } from "@/apis/gifticonApi";
import { UserGifticonInfo } from "@/types/gifticon";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import LottieAnimation from "@/app/componnents/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["usergifticons"],
    queryFn: fetchUserGifticons,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const StorageCard = () => (
  <div className="w-[120px] h-[150px] p-4 rounded-lg shadow-lg bg-[#CBDCEB] font-noto flex flex-col justify-between">
    <div className="text-lg font-bold">
      <p>기프티콘</p>
      <p>보관함</p>
    </div>
    <div className="flex justify-center">
      <LottieAnimation
        animationData={CUSTOM_ICON.ticket}
        loop={true}
        width={40}
        height={40}
        autoplay={true}
      />
    </div>
  </div>
);

export default function GifticonSwipe() {
  const { data: usergifticons = [], isError } = useQuery<UserGifticonInfo[]>({
    queryKey: ["usergifticons"],
    queryFn: fetchUserGifticons,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[150px] px-8">
        <div className="bg-red-50 rounded-lg w-full h-full flex items-center justify-center p-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <LottieAnimation
                animationData={CUSTOM_ICON.emty}
                loop={true}
                width={40}
                height={40}
                autoplay={true}
              />
            </div>
            <p className="text-red-500 font-noto text-sm">
              일시적인 오류가 발생했습니다
            </p>
            <p className="text-red-400 font-noto text-xs mt-1">
              잠시 후 다시 시도해주세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-scroll overflow-y-hidden [&::-webkit-scrollbar]:hidden px-8 py-4 gap-3">
      <Link href="/mygifticon" className="shrink-0">
        <StorageCard />
      </Link>

      {usergifticons.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-w-[200px] h-[150px] bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <LottieAnimation
                animationData={CUSTOM_ICON.emty}
                loop={true}
                width={40}
                height={40}
                autoplay={true}
              />
            </div>
            <p className="text-gray-500 font-noto text-sm px-4">
              보유한 기프티콘이 없습니다
            </p>
          </div>
        </div>
      ) : (
        usergifticons.map((gifticon: UserGifticonInfo, index: number) => (
          <Link
            key={gifticon.userItemId}
            href={`/mygifticon/${gifticon.userItemId}`}
            className="shrink-0"
          >
            <div className="w-[120px] h-[150px] rounded-lg backdrop-blur-lg bg-white/30 shadow-lg flex flex-col justify-between p-4">
              <div className="flex justify-center items-center flex-1">
                <div className="w-[80px] h-[80px] overflow-hidden rounded-sm">
                  <Image
                    src={gifticon.itemImage}
                    alt={gifticon.itemName}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-sm font-bold font-noto truncate">
                  {gifticon.itemName}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
