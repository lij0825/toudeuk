"use client";
import { fetchGifticonList } from "@/apis/gifticonApi";
import { CUSTOM_ICON } from "@/constants/customIcons";
import { GifticonInfo, ItemType } from "@/types/gifticon";
import getFilterClass from "@/utils/getFilterClass";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  { ssr: false }
);

export default function Gifticon() {
  const [filter, setFilter] = useState<ItemType>(ItemType.ALL);
  

  const {
    data: gifticons = [],
    isLoading,
    error,
  } = useQuery<GifticonInfo[]>({
    queryKey: ["gifticons"],
    queryFn: fetchGifticonList,
  });

  const filterHandler = (selectedFilter: ItemType) => {
    setFilter(selectedFilter);
  };

  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="flex flex-col h-screen">
      <section className="typo-title flex mb-2 items-end justify-between flex-shrink-0">
        <div>
          <p>Gifticon</p>
          <p>Shop</p>
        </div>
      </section>
      <section className="pb-3 font-noto text-sm">
        <div className="grid grid-cols-5 gap-2 items-end">
          <button
            type="button"
            onClick={() => filterHandler(ItemType.ALL)}
            className="flex flex-col items-center"
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.shop}
              loop={true}
              width={40}
              height={40}
              isSelected={filter === ItemType.ALL}
            />
            <span className={`font-xs ${getFilterClass(filter, ItemType.ALL)}`}>
              전체보기
            </span>
          </button>

          <button
            type="button"
            onClick={() => filterHandler(ItemType.CHICKEN)}
            className="flex flex-col items-center"
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.chicken}
              loop={true}
              width={50}
              height={50}
              isSelected={filter === ItemType.CHICKEN}
            />
            <span
              className={`font-xs ${getFilterClass(filter, ItemType.CHICKEN)}`}
            >
              치킨
            </span>
          </button>

          <button
            type="button"
            onClick={() => filterHandler(ItemType.COFFEE)}
            className="flex flex-col items-center"
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.coffee}
              loop={true}
              width={50}
              height={50}
              isSelected={filter === ItemType.COFFEE}
            />
            <span className={`${getFilterClass(filter, ItemType.COFFEE)}`}>
              커피
            </span>
          </button>

          <button
            type="button"
            onClick={() => filterHandler(ItemType.VOUCHER)}
            className="flex flex-col items-center"
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.voucher}
              loop={true}
              width={50}
              height={50}
              isSelected={filter === ItemType.VOUCHER}
            />
            <span className={`${getFilterClass(filter, ItemType.VOUCHER)}`}>
              바우처
            </span>
          </button>

          <button
            type="button"
            onClick={() => filterHandler(ItemType.ETC)}
            className="flex flex-col items-center"
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.dataset}
              loop={true}
              width={30}
              height={30}
              isSelected={filter === ItemType.ETC}
            />
            <span className={`${getFilterClass(filter, ItemType.ETC)} mt-2`}>
              기타
            </span>
          </button>
        </div>
      </section>
      <section className="flex-grow h-full rounded-xl overflow-y-auto scrollbar-hidden font-noto">
        <div className="grid grid-cols-2 gap-4">
          {gifticons
          .filter((gifticon) =>
            filter === ItemType.ALL ? true : gifticon.itemType === filter
          )
          .map((gifticon) => (
            <Link
              key={gifticon.itemId}
              href={`/gifticon/${gifticon.itemId}`}
              className="p-4 border rounded-lg relative h-48 my-2 backdrop-blur-lg bg-white/30 shadow-lg flex flex-col items-center"
              style={{
                backgroundImage:
                  "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
              }}
            >
              <div className="relative w-full h-24">
                <Image
                  src={gifticon.itemImage}
                  alt={gifticon.itemName}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-center mt-4 font-semibold text-sm">
                {gifticon.itemName.length > 9
                  ? `${gifticon.itemName.slice(0, 9)}...`
                  : gifticon.itemName}
              </p>
              <p className="text-center text-gray-500 text-sm mt-1">
                {`${gifticon.itemPrice.toLocaleString()} P`}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
