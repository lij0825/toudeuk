"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ListItemInfo } from "@/types/mypageInfo";

export default function NeonList({ content, href }: ListItemInfo) {
  const router = useRouter();

  // 클릭 시 지정된 페이지로 이동하는 함수
  const handleClick = () => {
    router.push(href);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="min-w-[390px] w-full max-w-2xl h-[50px] relative overflow-hidden rounded-xl bg-gradient-to-br from-[#ffffff] to-[#2a2a2a] shadow-xl mb-1">
        {/* Neon glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fffc80] to-[#ffffff80] opacity-30 blur-xl"></div>
        {/* Card content */}
        <div className="relative z-10 flex flex-col items-start justify-end h-full bg-[#ffffff10] backdrop-blur-sm border border-[#ffffff2e] rounded-xl">
          <h2 className="text-2xl font-bold text-white">{content}</h2>
        </div>
      </div>
    </div>
  );
}
