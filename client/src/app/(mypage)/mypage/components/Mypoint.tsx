"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/apis/myInfoApi";
import { UserInfo } from "@/types/mypageInfo";
import { toast } from "react-toastify";

export default function Mypoint() {
  const router = useRouter();

  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserInfo>({
    queryKey: ["ranks"], // 캐싱 키 설정
    queryFn: fetchUserInfo,
  });

  // 로딩 중일 때
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 Toastify로 에러 메시지 표시
  if (isError) {
    toast.error("Failed to load user information.");
  }

  // 데이터가 없는 경우 (안전하게 userInfo 존재 여부 확인)
  if (!userInfo) {
    return <div>No user information available</div>;
  }

  return (
    <div className="flex items-center justify-center bg-[#202020] font-gilroy font-extrabold">
      {/* Custom Card */}
      <div className="min-w-[390px] w-full max-w-2xl aspect-video relative overflow-hidden rounded-xl bg-gradient-to-br from-[#202020] to-[#2a2a2a] shadow-xl">
        {/* Neon glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff8880] to-[#ff00ff80] opacity-30 blur-xl"></div>
        {/* Card content */}
        <div className="relative z-10 flex flex-col items-start justify-end h-full p-6 bg-[#ffffff10] backdrop-blur-sm border border-[#ffffff30] rounded-xl">
          <p className="text-[#ffffffcc] text-sm mb-4">{userInfo?.nickName}</p>
          <Image
            //  src={userInfo?.profileImg || '/default-profile.png'}
            src={userInfo?.profileImg}
            width={40}
            height={40}
            objectFit="cover"
            alt="profile image"
            className="rounded-full border border-gray-300"
          />
          <h2 className="text-2xl font-bold text-white mb-2">내 포인트</h2>
          <p className="text-[#ffffffcc] text-sm mb-4">{userInfo.cash}</p>
          <button
            onClick={() => {
              router.push("/point");
            }}
          >
            내 포인트 이동
          </button>
        </div>
      </div>
    </div>
  );
}
