"use client";

import { fetchUserInfo } from "@/apis/userInfoApi";
import { UserInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import ProfileSetting from "./ProfileSetting";
import { useUserInfoStore } from "@/store/userInfoStore";

export default function UserInfoItem() {
  const userProfile = useUserInfoStore((state) => state.userInfo);

  const { data: userInfo, isError } = useQuery<UserInfo>({
    queryKey: ["user"], // 캐싱 키 설정
    queryFn: fetchUserInfo,
  });

  // 에러가 발생했을 때 Toastify로 에러 메시지 표시
  if (isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  return (
    <div>
      <section className="flex align-center pb-4 justify-between">
        <div className="flex items-center">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-2">
            <Image
              src={userProfile?.profileImg || "/default_profile.jpg"}
              alt="Profile Image"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <span className="font-noto text-lg font-extrabold ml-2">
            {userProfile?.nickName}
          </span>
        </div>
        <div>
          <ProfileSetting />
        </div>
      </section>
      <Link href="/point" className="block">
        <div className="bg-primary px-5 py-4 rounded-lg text-white flex items-center justify-between cursor-pointer">
          <div className="flex items-center">
            <Image
              src={"/icons/coin.png"}
              alt="coin Image"
              width={34}
              height={34}
            />
            <div className="ml-2 typo-sub-title">
              {userInfo ? userInfo.cash : 0}pt
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // 상위 박스의 클릭 이벤트 중단
              window.location.href = "/kapay"; // /kapay로 이동
            }}
            className="p-2 bg-blue-500 font-noto text-white rounded-md text-sm hover:bg-blue-600 transition duration-150"
          >
            충전하기
          </button>
        </div>
      </Link>
    </div>
  );
}
