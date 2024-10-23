"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

// 더미 데이터
const gifticons = [
  { id: 1, name: "스타벅스 아메리카노", image: "https://bizimg.giftishow.com/Resource/goods/2023/G00002401431/G00002401431.jpg" },
  { id: 2, name: "N페이 상품권", image: "https://bizimg.giftishow.com/Resource/goods/2023/G00001981040/G00001981040.jpg" },
  { id: 3, name: "GS25 상품권", image: "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg" },
  { id: 4, name: "Burger", image: "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg" },
  { id: 5, name: "Cake", image: "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg" },
];

export default function Gifticon() {
  // 캐러셀 인덱스 상태
  const [currentIndex, setCurrentIndex] = useState(0);

  // 캐러셀에서 이전 슬라이드로 이동
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? gifticons.length - 1 : prevIndex - 1));
  };

  // 캐러셀에서 다음 슬라이드로 이동
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === gifticons.length - 1 ? 0 : prevIndex + 1));
  };

  // react-swipeable을 사용한 스와이프 핸들러
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
  });

  return (
    <div className="p-4">
      {/* 인기 있는 기프티콘 캐러셀 */}
      <div className="relative w-full h-64" {...swipeHandlers}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">인기 기프티콘</h2>
        </div>
        <div className="relative w-full h-full overflow-hidden">
          <div
            className="absolute inset-0 flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {gifticons.map((gifticon) => (
              <Link key={gifticon.id} href={`/gifticon/${gifticon.id}`} className="w-full flex-shrink-0 flex justify-center items-center">
                <Image src={gifticon.image} alt={gifticon.name} width={180} height={80} />
              </Link>
            ))}
          </div>
        </div>
        {/* 왼쪽/오른쪽 화살표 */}
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
          onClick={handlePrev}
        >
          {"<"}
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
          onClick={handleNext}
        >
          {">"}
        </button>
      </div>

      {/* 다른 기프티콘 리스트 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">다른 기프티콘</h2>
        <div className="grid grid-cols-2 gap-4">
          {gifticons.map((gifticon) => (
            <Link key={gifticon.id} href={`/gifticon/${gifticon.id}`} className="p-4 border rounded-lg">
              <Image src={gifticon.image} alt={gifticon.name} width={180} height={80} />
              <p className="text-center mt-2">{gifticon.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
