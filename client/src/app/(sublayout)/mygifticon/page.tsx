"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchUserGifticons } from "@/apis/gifticonApi";
import { UserGifticonInfo, ItemType } from "@/types/gifticon";
import { toast } from "react-toastify";
import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";

const ItemTypeColors: Record<ItemType, string> = {
  [ItemType.ALL]: "#9E9E9E", // Neutral gray for "ALL"
  [ItemType.CHICKEN]: "#FF7043", // Warm orange for "CHICKEN"
  [ItemType.COFFEE]: "#795548", // Coffee brown for "COFFEE"
  [ItemType.VOUCHER]: "#FFC107", // Bright yellow for "VOUCHER"
  [ItemType.ETC]: "#4DB6AC", // Teal for "ETC"
};




// MyGifticon Component
export default function MyGifticon() {
  const router = useRouter();
  const [filter, setFilter] = useState<ItemType>(ItemType.ALL);

  const { data: usergifticons = [], isError } = useQuery<UserGifticonInfo[]>({
    queryKey: ["usergifticons"],
    queryFn: fetchUserGifticons,
  });

  if (isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  return (
    <div className="flex flex-col h-full">
      <section className="typo-title flex mb-4 items-end justify-between flex-shrink-0">
        <div>
          <p>My</p>
          <p>Gifticon</p>
        </div>

        <LottieAnimation
          animationData={CUSTOM_ICON.emty}
          loop={true}
          width={70}
          height={70}
          autoplay={true}
        />
      </section>

      <section className="flex-grow h-full rounded-xl">
      {/* 기프티콘이 없을때 */}
        {usergifticons.length === 0 ? (
          <div className="flex flex-1 bg-[#FAF7F0] h-full items-center justify-center rounded-lg">
            <div className="flex flex-col items-center">
              <LottieAnimation
                animationData={CUSTOM_ICON.emty}
                loop={true}
                width={80}
                height={80}
                autoplay={true}
              />
              <p className="text-gray-500 font-noto text-md px-4">
                보유한 기프티콘이 없습니다
              </p>
              <button
                type="button"
                onClick={() => router.push("/gifticon")}
                className="bg-[#EDDFE0] ml-auto px-3 py-1 rounded-lg text-sm bg-gray-500 hover:bg-[#FFB38E] text-white w-full"
              >
                기프티콘 사러가기
              </button>
            </div>
          </div>
        ) : (
          usergifticons.map((gifticon: UserGifticonInfo) => (
            <Link
              key={gifticon.userItemId}
              href={`/mygifticon/${gifticon.userItemId}`}
              className="p-4  rounded-lg relative my-6 backdrop-blur-lg bg-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden"
            >
              <div className="flex justify-center">
                <Image
                  src={gifticon.itemImage}
                  alt={gifticon.itemName}
                  width={180}
                  height={80}
                  className="h-20 w-full rounded-lg object-cover shadow-sm"
                />
              </div>
              <div className="text-center mt-4 font-semibold text-gray-700">
                {gifticon.itemName}
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
