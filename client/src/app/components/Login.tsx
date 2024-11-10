"use client";

import { useEffect, useState } from "react";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트되면 애니메이션이 시작됩니다.
    setIsVisible(true);
  }, []);

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리 함수 (구현 필요)
    console.log("카카오 로그인", process.env.NEXT_PUBLIC_API_URL);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao?redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}`;
  };

  return (
    <div className="w-full">
      <button
        onClick={handleKakaoLogin}
        className={`flex typo-sub-title font-bold p-2 items-center justify-center w-full rounded-md bg-[#FEE500] text-black transition duration-10000
        ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-5"}
      `}
      >
        Game Start
      </button>
    </div>
  );
}
