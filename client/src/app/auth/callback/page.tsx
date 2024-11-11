"use client";

import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import useGetUserInfo from "@/apis/user/useGetchUserInfo";

export default function OauthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");

      if (accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
        setToken(accessToken); // 토큰 설정
        setIsLogin(true);
      }
    }
  }, []);

  // token이 있을 때만 useGetUserInfo 쿼리를 실행하고 로딩 상태를 확인
  const { data, isLoading } = useGetUserInfo(token);

  useEffect(() => {
    if (isLogin && data && !isLoading) {
      window.location.href = "/toudeuk";
    } else {
      window.location.href = "/";
    }
  }, [isLogin, data, isLoading]);

  return <Loading />;
}
