"use client";

import { fetchUserInfo } from "@/apis/userInfoApi";
import { UserInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { HiInformationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

export default function MyPoint() {
  // 설명 토글 함수
  const handleInfoClick = () => {
    toast.info("잔여 포인트입니다", {
      position: "top-center",
      theme: "light",
    });
  };

  const { data: userInfo, isError } = useQuery<UserInfo>({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
  });

  if (isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="p-8 rounded-3xl shadow-md w-full max-w-md bg-primary"
      // style={{
      //   borderColor: "#4A505B",
      //   borderWidth: "2px",
      // }}
      >
        <div className="flex items-center mb-6">
          <h2 className="text-3xl text-white font-bold">내 포인트</h2>
          <button onClick={handleInfoClick} className="ml-2">
            <HiInformationCircle className="text-white w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-3xl text-white font-semibold">{userInfo?.cash}pt</h3>
          </div>
          <Link href="/kapay">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-md hover:bg-blue-600 transition duration-150"
            >
              충전하기
            </button>
            {/* <button className="bg-transparent text-white font-semibold py-2 px-4 rounded border border-white transition duration-200 hover:bg-white hover:text-black">
              충전하기
            </button> */}
          </Link>
        </div>
      </div>
    </div>
  );
}
