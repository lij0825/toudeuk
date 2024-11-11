"use client";

import { fetchUserInfo } from "@/apis/userInfoApi";
import { UserInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import ProfileSetting from "./ProfileSetting";

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
    <div>
      <section className="flex align-center pb-4 justify-between">
        <div className="flex items-center">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden mr-2">
            <Image
              src={userInfo?.profileImg || "/default_profile.jpg"}
              alt="Profile Image"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <span className="font-noto text-lg font-extrabold  ml-2">
            {userInfo?.nickName}
          </span>
        </div>
        <div>
          <ProfileSetting />
        </div>
      </section>
      <>
        <Link href={"/point"}>
          <div className="bg-primary px-5 py-4 rounded-md text-white flex items-center">
            <div>
              <Image
                src={"/icons/coin.png"}
                alt="coin Image"
                width={34}
                height={34}
              />
            </div>
            <div className="ml-2 typo-sub-title">
              {userInfo ? userInfo.cash : 0}pt
            </div>
          </div>
        </Link>
      </>
    </div>
  );
}
