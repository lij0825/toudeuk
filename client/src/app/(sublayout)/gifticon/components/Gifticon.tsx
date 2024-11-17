"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { fetchGifticonList } from "@/apis/gifticonApi";
import { CUSTOM_ICON } from "@/constants/customIcons";
import { GifticonInfo, ItemType } from "@/types/gifticon";
import getFilterClass from "@/utils/getFilterClass";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  { ssr: false }
);

export default function Gifticon() {
  const [filter, setFilter] = useState<ItemType>(ItemType.ALL);

  const { data: gifticons = [], error } = useQuery<GifticonInfo[]>({
    queryKey: ["gifticons"],
    queryFn: fetchGifticonList,
  });

  const filters = [
    { type: ItemType.ALL, label: "전체보기", icon: CUSTOM_ICON.shop, size: 40 },
    {
      type: ItemType.CHICKEN,
      label: "치킨",
      icon: CUSTOM_ICON.chicken,
      size: 50,
    },
    {
      type: ItemType.COFFEE,
      label: "커피",
      icon: CUSTOM_ICON.coffee,
      size: 50,
    },
    {
      type: ItemType.VOUCHER,
      label: "바우처",
      icon: CUSTOM_ICON.voucher,
      size: 50,
    },
    { type: ItemType.ETC, label: "기타", icon: CUSTOM_ICON.dataset, size: 30 },
  ];

  const truncateText = (text: string, length: number) =>
    text.length > length ? `${text.slice(0, length)}...` : text;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <button
          onClick={() => location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <section className="mb-2 items-end justify-between flex-shrink-0">
        <p className="typo-title">Gifticon</p>
        <div className="flex items-end">
          <p className="mr-2 typo-title">Shop</p>
        </div>
      </section>

      <section className="pb-3 font-noto text-sm">
        <div className="grid grid-cols-5 gap-2 items-end">
          {filters.map((filterOption) => (
            <button
              key={filterOption.type}
              type="button"
              onClick={() => setFilter(filterOption.type)}
              className="flex flex-col items-center"
            >
              <LottieAnimation
                animationData={filterOption.icon}
                loop={true}
                width={filterOption.size}
                height={filterOption.size}
                isSelected={filter === filterOption.type}
              />
              <span
                className={`font-xs ${getFilterClass(
                  filter,
                  filterOption.type
                )}`}
              >
                {filterOption.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 판매 목록 */}
      <section className="flex-grow h-full rounded-xl overflow-y-auto scrollbar-hidden -mx-8 -mb-8 px-8 pb-[90px] font-noto">
        {gifticons.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {gifticons
              .filter((gifticon) =>
                filter === ItemType.ALL ? true : gifticon.itemType === filter
              )
              .map((gifticon) => (
                <Link
                  key={gifticon.itemId}
                  href={`/gifticon/${gifticon.itemId}`}
                  className="p-4 border rounded-lg relative h-56 my-1 backdrop-blur-lg bg-white/30 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:bg-white/60 focus:scale-105 active:scale-100"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top left, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 70%)",
                  }}
                >
                  <div className="relative w-full h-[60%]">
                    <Image
                      src={gifticon.itemImage}
                      alt={gifticon.itemName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                      priority
                    />
                  </div>
                  <p className="text-center mt-4 font-semibold text-sm">
                    {truncateText(gifticon.itemName, 9)}
                  </p>
                  <p className="text-center text-gray-500 text-sm mt-1">
                    {`${gifticon.itemPrice.toLocaleString()} P`}
                  </p>
                </Link>
              ))}
          </div>
        ) : (
          <p className="flex flex-col items-center rounded-lg justify-center text-gray-600 font-noto h-full bg-gray-200">
            판매중인 상품이 없습니다.
          </p>
        )}
      </section>
    </div>
  );
}
