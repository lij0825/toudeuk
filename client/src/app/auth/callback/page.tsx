"use client";
import { useWebSocketStore } from "@/store/useWebSocketStore ";
import { useEffect } from "react";
import Loading from "@/app/loading";

export default function useOauth() {
  const connect = useWebSocketStore((state) => state.connect);
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 클라이언트 측에서만 실행
      const params = new URLSearchParams(window.location.search);
      const token = params.get("accessToken");
      console.log(token);

      if (token) {
        sessionStorage.setItem("accessToken", token);
        connect(token);
        window.location.href = "/toudeuk";
      }
    }
  }, [connect]);

  return Loading;
}
