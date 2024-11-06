"use client";
import { fetchGifticonList } from "@/apis/gifticonApi";
import { GifticonInfo } from "@/types/gifticon";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Gifticon() {
  // 캐러셀 인덱스 상태

  const {
    data: gifticons = [],
    isLoading,
    error,
  } = useQuery<GifticonInfo[]>({
    queryKey: ["gifticons"],
    queryFn: fetchGifticonList,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="">
      <h2 className="typo-title font-bold mb-8 bg-white rounded-lg">
        Gifticon <br /> Shop
      </h2>
      <div className="mt-8 h-screen rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          {gifticons.map((gifticon) => (
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
      </div>
    </div>
  );
}
