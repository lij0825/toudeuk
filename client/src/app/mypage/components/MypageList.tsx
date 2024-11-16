"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavItemInfo {
  label: string;
  href: string;
}

export default function MypageList() {
  const router = useRouter();

  const navItems: NavItemInfo[] = [
    { label: "History", href: "/history" },
    { label: "Gifticon Shop", href: "/gifticon" },
  ];

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col h-full font-noto text-xl relative z-10 mt-1">
      {/* 첫 번째 카드 */}
      <div
        className="flex-1 h-1/2 bg-[#F5EFFF] p-4 rounded-lg flex cursor-pointer relative overflow-hidden mb-4"
        onClick={() => handleClick(navItems[0].href)}
      >
        <div>
          <div className="text-lg font-bold">게임 기록</div>
          <div className="text-sm text-secondary">게임 기록 및 당첨내역</div>
        </div>
        <div className="absolute bottom-0 right-2 w-[75%] h-[75%] max-w-[100px] max-h-[100px] animate-floating-delayed-1">
          <Image
            src={"/icons/clock.png"}
            alt={"history icon"}
            fill
            sizes="(max-width: 768px) 50vw, 20vw" // 화면 크기에 따른 이미지 크기 설정
            className="rounded-sm object-contain"
            priority
          />
        </div>
      </div>

      {/* 두 번째 카드 */}
      <div
        className="flex-1 h-1/2 bg-[#FF8A8A] p-4 rounded-lg flex cursor-pointer relative overflow-hidden"
        onClick={() => handleClick(navItems[1].href)}
      >
        <div>
          <div className="text-lg font-bold">기프티콘 샵</div>
          <div className="text-sm text-white">포인트로 구매하기</div>
        </div>
        <div className="absolute bottom-2 right-2 w-[75%] h-[75%] max-w-[100px] max-h-[100px] animate-floating-delayed-2">
          <Image
            src={"/icons/party-popper-with-confetti.png"}
            alt={"gifticon icon"}
            fill
            sizes="(max-width: 768px) 50vw, 20vw" // 화면 크기에 따른 이미지 크기 설정
            className="rounded-sm object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
