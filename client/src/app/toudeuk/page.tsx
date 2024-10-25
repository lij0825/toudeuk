"use client"
import { useAuthStore } from "@/store/userAuthStore";
import Button from "./components/Button";
import CurrentRank from "./components/CurrentRank";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Toudeuk() {
  const setAuth = useAuthStore((state) => state.setAccessToken)
  const urlParams = new URLSearchParams(window.location.search);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const accessToken = urlParams.get('accessToken');

    console.log(accessToken)

    if (accessToken) {
      // Zustand 스토어에 인증 정보 설정
      setAuth(accessToken);
      sessionStorage.setItem('accessToken', accessToken);
    }

    console.log('accessToken', accessToken)

  }, [setAuth]);

  const handleArrowClick = () => {
    setIsAnimating(true); // 애니메이션 시작

    // 잠시 후 페이지 이동
    setTimeout(() => {
      window.location.href = "/mypage"; // 페이지 이동
    }, 300);
    // 스크롤을 위로 이동
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <div className="flex flex-col items-center justify-center flex-grow">
        <CurrentRank rank={7} />
        <Button />
      </div>
      <div className="flex justify-center w-full mt-auto mb-4">
        <button
          onClick={handleArrowClick}
          className="bg-transparent text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition transform hover:scale-110"
          aria-label="Scroll to top and go to MyPage"
        >
          마이페이지
        </button>
      </div>
    </div>
  );
}
