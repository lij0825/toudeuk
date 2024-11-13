"use client";

import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";
// 소켓 연결 또는 SSE 방식으로 touch값 fetch
import { useState } from "react";

interface GameProps {
  totalClick: number;
}

export default function GameButton({ totalClick }: GameProps) {
  return (
    <>
      {/* 테두리가 회전하는 버튼 */}
      <button
        data-cy="button"
        className="flex flex-col items-center relative" // relative 추가
      >
        {/* Lottie 애니메이션 */}
        <LottieAnimation
          animationData={CUSTOM_ICON.snowframe}
          loop={true}
          autoplay={true}
          width={250}
          height={250}
        />

        {/* 수신된 count가 있을 때만 표시 */}
        {totalClick !== null && (
          <span
            className="absolute top-1/2 transform -translate-y-1/2 z-10 text-4xl text-[#00ff88] hover:text-[#ff00ff] transition-colors duration-300"
            style={{ pointerEvents: "none" }}
          >
            {totalClick}
          </span>
        )}
      </button>
    </>
  );
}
