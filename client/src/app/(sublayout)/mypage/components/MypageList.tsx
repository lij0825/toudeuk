"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NavItemInfo } from "@/types/mypageInfo";

export default function MypageList() {
  const router = useRouter();

  const navItems: NavItemInfo[] = [
    { label: "Rewards", href: "/prize" },
    { label: "My Prize", href: "/prize" },
    { label: "Ranking", href: "/rank" },
    { label: "History", href: "/gifticon" },
  ];

  // 클릭 시 지정된 페이지로 이동하는 함수
  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div>
      {navItems.map((item, index) => (
        <div
          key={index}
          onClick={() => handleClick(item.href)}
          className="card typo-sub-title my-5"
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
