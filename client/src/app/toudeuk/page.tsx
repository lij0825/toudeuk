"use client"
import { useAuthStore } from "@/store/userAuthStore";
import Button from "./components/Button";
import CurrentRank from "./components/CurrentRank";
import { useEffect } from "react";

export default function Toudeuk() {
  const setAuth = useAuthStore((state) => state.setAccessToken)
  const urlParams = new URLSearchParams(window.location.search);

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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <CurrentRank rank={7} />
      <Button />
      {/* <PlayRoom/> */}
    </div>
  );
}
