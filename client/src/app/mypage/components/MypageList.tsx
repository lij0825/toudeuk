"use client";

import { NavItemInfo } from "@/types/mypageInfo";
import { useRouter } from "next/navigation";

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
    <div className="flex gap-4 h-full font-noto text-xl">
      <div className="flex flex-col gap-4 flex-1 h-full">
        <div
          className="bg-green-500 p-4 rounded-lg flex-grow flex cursor-pointer"
          onClick={() => handleClick(navItems[1].href)}
        >
          {navItems[1].label}
        </div>
        <div
          className="bg-red-500 p-4 rounded-lg flex-grow flex cursor-pointer"
          onClick={() => handleClick(navItems[2].href)}
        >
          {navItems[2].label}
        </div>
      </div>
      <div
        className="flex-1 bg-blue-500 p-4 rounded-lg flex cursor-pointer"
        onClick={() => handleClick(navItems[0].href)}
      >
        {navItems[0].label}
      </div>
    </div>
  );
}
