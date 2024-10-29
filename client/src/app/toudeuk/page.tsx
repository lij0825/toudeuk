"use client"
import Link from "next/link";
import Button from "./components/Button";
import CurrentRank from "./components/CurrentRank";
import { useEffect } from "react";
// import { useAuthStore } from "@/store/userAuthStore";

export default function Toudeuk() {
  // const urlParams = new URLSearchParams(window.location.search);
  // const setAuth = useAuthStore((state) => state.setAccessToken)

  useEffect(() => {
      // URLSearchParams를 사용하여 쿼리 파라미터에서 authorization 값 가져오기
      const params = new URLSearchParams(window.location.search);
      const token = params.get('Authorization'); // 'authorization' 파라미터 가져오기
      console.log(token)
      if (token) {
        sessionStorage.setItem('accessToken', token);
      }
  }, []);

  // useEffect(() => {
  //   const accessToken = urlParams.get('accessToken');

  //   console.log(accessToken)

  //   if (accessToken) {
  //     // Zustand 스토어에 인증 정보 설정
  //     setAuth(accessToken);
  //     sessionStorage.setItem('accessToken', accessToken);
  //   }

  //   console.log('accessToken', accessToken)

  // }, [setAuth]);

  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <div className="flex flex-col items-center justify-center flex-grow">
        <CurrentRank rank={7} />
        <Button />
      </div>
      <div className="flex justify-center w-full mt-auto mb-4">
        <Link href={"/mypage"}>
          <button
            className="bg-transparent text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition transform hover:scale-110"
            aria-label="Scroll to top and go to MyPage"
          >
            마이페이지
          </button>
        </Link>
      </div>
    </div>
  );
}
