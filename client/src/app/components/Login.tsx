"use client";

import { useEffect, useState } from "react";

export default function Login() {
  const handleKakaoLogin = () => {
    // 카카오 로그인 처리 함수 (구현 필요)
    console.log("카카오 로그인", process.env.NEXT_PUBLIC_API_URL);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao?redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}`;
  };

  return (
    <div className="flex justify-center items-center min-w-[150px] min-h-[150px]  rounded-full bg-[#FEE500]">
      <button
        onClick={handleKakaoLogin}
        className={`typo-title font-bold h-full w-full p-2
      `}
      >
        <p>Game</p>
        <p>Start</p>
      </button>
    </div>
  );
}
