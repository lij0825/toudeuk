"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFetchUserGifticon } from "@/apis/gifticon/useFetchUserGifticon";
import { UserGifticonInfo, ItemType } from "@/types/gifticon";
import dynamic from "next/dynamic";
import { CUSTOM_ICON } from "@/constants/customIcons";
import getFilterClass from "@/utils/getFilterClass";

// LottieAnimation을 동적으로 로드, 서버사이드 렌더링 오류 방지
const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  { ssr: false }
);

export default function MyGifticon() {
  const [filter, setFilter] = useState<ItemType>(ItemType.ALL);
  const router = useRouter();

  const {
    data: usergifticons = [],
    isError,
    isLoading,
  } = useFetchUserGifticon();

  const filterHandler = (selectedFilter: ItemType) => {
    setFilter(selectedFilter);
  };

  return (
    <div className="flex flex-col h-full">
      <section className="typo-title flex mb-2 items-end justify-between flex-shrink-0">
        <div>
          <p>My</p>
          <p>Gifticon</p>
        </div>
      </section>

      {/* 필터링 바 섹션 */}
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

      {/* 내용 섹션 */}
      <section className="flex-grow h-full rounded-xl overflow-auto scrollbar-hidden font-noto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LottieAnimation
              animationData={CUSTOM_ICON.mainLoading}
              loop={true}
              width={80}
              height={80}
              autoplay={true}
            />
            <p className="ml-4 text-gray-600">로딩 중...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
              데이터를 불러오는 중 오류가 발생했습니다.
            </p>
          </div>
        ) : usergifticons.length === 0 ? (
          <div className="flex flex-1 bg-[#FAF7F0] h-full items-center justify-center rounded-lg border">
            <div className="flex flex-col items-center">
              <LottieAnimation
                animationData={CUSTOM_ICON.emty}
                loop={true}
                width={80}
                height={80}
                autoplay={true}
                isSelected={true}
              />
              <p className="text-gray-500 text-md px-4 mb-2">
                보유한 기프티콘이 없습니다
              </p>
              <button
                type="button"
                onClick={() => router.push("/gifticon")}
                className="bg-[#FFB38E] px-3 py-1 rounded-lg text-sm hover:bg-[#f9bc9e] text-white w-full"
              >
                기프티콘 사러가기
              </button>
            </div>
          </div>
        ) : (
          usergifticons
            .filter((gifticon) =>
              filter === ItemType.ALL ? true : gifticon.itemType === filter
            )
            .map((gifticon: UserGifticonInfo) => (
              <Link
                key={gifticon.userItemId}
                href={`/mygifticon/${gifticon.userItemId}`}
                className={`block p-4 rounded-lg mb-4 bg-[#ebebeb] hover:shadow-xl transition-all duration-200 active:scale-95 w-full ${
                  gifticon.used ? "opacity-50" : ""
                }`}
              >
                <div className="flex justify-center w-full relative">
                  <Image
                    src={gifticon.itemImage}
                    alt={gifticon.itemName}
                    width={170}
                    height={80}
                    className="h-20 w-full rounded-lg object-cover shadow-sm"
                  />
                  {gifticon.used && (
                    <div className="absolute inset-0 bg-gray-500 opacity-50 rounded-lg" />
                  )}
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
