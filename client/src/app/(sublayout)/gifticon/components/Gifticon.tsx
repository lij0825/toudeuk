"use client";
import { fetchGifticonList } from '@/apis/gifticonApi';
import { GifticonInfo } from '@/types/gifticon';
import { useQuery } from '@tanstack/react-query';
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Gifticon() {
  // 캐러셀 인덱스 상태

  const { data: gifticons = [], isLoading, error } = useQuery<GifticonInfo[]>({
    queryKey: ['gifticons'],
    queryFn: fetchGifticonList,
  })

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <>
      <h2 className="typo-title font-bold mb-6">
        Gifticon <br /> Shop
      </h2>
      <div className="mt-8">
        {/* <h2 className="text-xl font-bold mb-4">다른 기프티콘</h2> */}
        <div className="grid grid-cols-2 gap-4">
          {gifticons.map((gifticon) => (
            <Link
              key={gifticon.itemId}
              href={`/gifticon/${gifticon.itemId}`}
              className="p-4 border rounded-lg relative h-32 my-6 backdrop-blur-lg bg-white/30 shadow-lg" // relative 속성 추가
              style={{
                backgroundImage:
                  "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
              }}
            >
              <Image
                src={gifticon.itemImage}
                alt={gifticon.itemName}
                width={180}
                height={80}
                className="h-20 rounded-lg w-4/5 absolute top-[-20%] left-1/2 transform -translate-x-1/2" // 80% 너비 및 위로 이동
              />
              <p className="text-center mt-12 relative z-10">{gifticon.itemName}</p>{" "}
              {/* p 태그의 상단 마진 조정 */}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
