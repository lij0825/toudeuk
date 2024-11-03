"use client";

import { fetchUserInfo } from "@/apis/userInfoApi";
import { UserInfo } from "@/types/mypageInfo";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import SettingButton from "./Setting";

export default function UserInfoItem() {
  const { data: userInfo, isError } = useQuery<UserInfo>({
    queryKey: ["user"], // 캐싱 키 설정
    queryFn: fetchUserInfo,
  });

  // 에러가 발생했을 때 Toastify로 에러 메시지 표시
  if (isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  return (
    <div className="typo-sub-title">
      <section className="flex align-center pb-8 justify-between">
        <div className="flex items-cente">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-4">
            <Image
              src={userInfo?.profileImg || "/default_profile.jpg"}
              alt="Profile Image"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <span>{userInfo?.nickName}</span>
        </div>
        <SettingButton />
      </section>
      <>
        <Link href={"/point"}>
          <div className="bg-secondary p-5 rounded-xl text-white">
            {userInfo ? userInfo.cash : 0}pt
          </div>
        </Link>
      </>
    </div>
  );
}
