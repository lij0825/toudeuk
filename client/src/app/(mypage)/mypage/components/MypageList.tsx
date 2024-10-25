"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ListItemInfo } from "@/types/mypageInfo";

export default function MypageList() {
  const router = useRouter();

  const Listitems: ListItemInfo[] = [
    { content: "리워드 내역", href: "/prize" },
    { content: "기프티콘 샵", href: "/gifticon" },
    { content: "랭킹 보기", href: "/rank" },
  ];

  // 클릭 시 지정된 페이지로 이동하는 함수
  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div>
      {Listitems.map((item, index) => (
        <div
          key={index}
          onClick={() => handleClick(item.href)}
          className="cursor-pointer"
        >
          <div className="w-full relative overflow-hidden rounded-xl bg-gradient-to-br from-[#ffffff] to-[#2a2a2a] shadow-xl mb-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f8fffc80] to-[#ffffff80] opacity-30 blur-xl"></div>
            <div className="relative z-10 flex flex-col items-start justify-end h-full bg-[#ffffff10] backdrop-blur-sm border border-[#ffffff2e] rounded-xl">
              <h2 className="text-2xl font-bold text-white">{item.content}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
