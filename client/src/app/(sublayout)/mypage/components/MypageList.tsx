"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NavItemInfo } from "@/types/mypageInfo";

export default function MypageList() {
  const router = useRouter();

  const navItems: NavItemInfo[] = [
    { label: "History", href: "/history" },
    { label: "Ranking", href: "/rank" },
    { label: "Gifticon Shop", href: "/gifticon" },
  ];

  // 클릭 시 지정된 페이지로 이동하는 함수
  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {navItems.map((item) => (
        <div
          key={item.label}
          onClick={() => handleClick(item.href)}
          className="flex items-center justify-center w-full cursor-pointer rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          style={{
            background: "linear-gradient(145deg, #d4af37, #a8861c)",
            boxShadow: "0 6px 8px rgba(0, 0, 0, 0.4)",
            padding: "3px",
          }}
        >
          <div
            className="flex items-center justify-center w-full h-full rounded-sm transition duration-300 ease-in-out transform hover:scale-105 hover:brightness-125"
            style={{
              background: "linear-gradient(145deg, #ffd700, #ffea7f)",
              boxShadow:
                "inset 0 -1px 4px rgba(210, 179, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.3)",
              transform: "translateY(-2px)",
            }}
          >
            <p
              className="text-white typo-sub-title text-center"
              style={{ fontSize: "3rem" }}
            >
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
