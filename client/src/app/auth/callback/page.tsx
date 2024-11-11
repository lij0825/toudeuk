"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Loading from "@/app/loading";
import useGetUserInfo from "@/apis/user/useGetchUserInfo";

export default function OauthPage() {
  const router = useRouter(); //캐시 소실 방지
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");

      if (accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
        setToken(accessToken);
        setIsLogin(true);
      }
    }
  }, []);

  // token이 있을 때만 useGetUserInfo 쿼리를 실행
  const { data, isLoading } = useGetUserInfo(token || null);

  useEffect(() => {
    if (!isLoading && !hasRedirected) {
      if (isLogin && data) {
        setHasRedirected(true);
        router.push("/toudeuk"); // 클라이언트 사이드 네비게이션
      } else if (!data && token) {
        setHasRedirected(true);
        router.push("/"); // 클라이언트 사이드 네비게이션
      }
    }
  }, [isLogin, data, isLoading, token, hasRedirected, router]);

  return <Loading />;
}
