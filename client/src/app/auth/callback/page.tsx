"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { UserPartialInfo } from "@/types";
import useGetUserInfo from "@/apis/user/useGetchUserInfo";
import { useUserInfoStore } from "@/store/userInfoStore";

export default function OauthPage() {
  const router = useRouter(); //캐시 소실 방지
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState<boolean>(false);
  const { setUserInfo } = useUserInfoStore();

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
        const partialData: UserPartialInfo = {
          userId: data.userId,
          nickName: data.nickName,
          profileImg: data.profileImg,
        };
        setHasRedirected(true);
        setUserInfo(partialData);
        router.push("/toudeuk"); // 클라이언트 사이드 네비게이션
      } else if (!data && token) {
        setHasRedirected(true);
        router.push("/"); // 클라이언트 사이드 네비게이션
      }
    }
  }, [isLogin, data, isLoading, token, hasRedirected, router, setUserInfo]);

  return <Loading />;
}
