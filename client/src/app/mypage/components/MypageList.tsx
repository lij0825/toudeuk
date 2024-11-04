"use client";

import { NavItemInfo } from "@/types/mypageInfo";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MypageList() {
  const router = useRouter();

  const navItems: NavItemInfo[] = [
    { label: "History", href: "/history" },
    { label: "Ranking", href: "/rank" },
    { label: "Gifticon Shop", href: "/gifticon" },
  ];

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex gap-4 h-full font-noto text-xl">
      <div className="flex flex-col gap-4 w-1/2">
        <div
          className="bg-[#E1FFEE] p-4 rounded-lg flex-1 flex cursor-pointer relative overflow-hidden"
          onClick={() => handleClick(navItems[1].href)}
        >
          <div className="z-10">
            <div className="text-xl font-bold">랭킹</div>
            <div className="text-sm text-secondary">최신 게임 클릭수</div>
          </div>
          <div className="absolute bottom-2 right-2 w-[90px] h-[90px] animate-floating">
            <Image
              src={"/icons/crown.png"}
              alt={"rank icon"}
              width={100}
              height={100}
              className="rounded-sm w-full h-full object-contain"
              priority
            />
          </div>
        </div>
        <div
          className="bg-[#F5EFFF] p-4 rounded-lg flex-1 flex cursor-pointer relative overflow-hidden"
          onClick={() => handleClick(navItems[0].href)}
        >
          <div className="z-10">
            <div className="text-xl font-bold">게임 기록</div>
            <div className="text-sm text-secondary">게임 기록 및 당첨내역</div>
          </div>
          <div className="absolute bottom-2 right-2 w-[100px] h-[100px] animate-floating-delayed-1">
            <Image
              src={"/icons/clock.png"}
              alt={"history icon"}
              width={100}
              height={100}
              className="rounded-sm w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <div
        className="w-1/2 bg-[#FF8A8A] p-4 rounded-lg flex cursor-pointer relative overflow-hidden"
        onClick={() => handleClick(navItems[2].href)}
      >
        <div className="z-10">
          <div className="text-xl font-bold">기프티콘 샵</div>
          <div className="text-sm text-white">포인트로 구매하기</div>
        </div>
        <div className="absolute bottom-4 right-2 w-[130px] h-[130px] animate-floating-delayed-2">
          <Image
            src={"/icons/party-popper-with-confetti.png"}
            alt={"gifticon icon"}
            width={130}
            height={130}
            className="rounded-sm w-full h-full object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
