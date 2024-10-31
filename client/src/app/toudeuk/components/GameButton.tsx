"use client";

import { fetchClick } from "@/apis/gameApi";
//소켓 연결 또는 SSE 방식으로 touch값 fetch
import { Client, Frame, IFrame, IMessage, Stomp } from "@stomp/stompjs";
import axios from "axios";
import { headers } from "next/headers";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function GameButton() {
  const [count, setCount] = useState<number>(0);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    // ! FIXME : 서버 주소 변경 필요
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      (frame: IFrame) => {
        console.log("Connected: " + frame);
        // 구독 등의 추가 설정
      },
      (error: Frame | string) => {
        console.error("Connection error: ", error);
      }
    );

    stompClient.connect({}, (frame: string) => {
      console.log("Connected: " + frame);
      stompClient.publish({
        destination: "/app/getInitialCount",
        body: JSON.stringify({}),
      });
      stompClient.subscribe("/topic/game", (message: IMessage) => {
        setCount(parseInt(message.body));
      });
    });

    setStompClient(stompClient);

    // Cleanup on unmount
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const handleClick = async() => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/game",
        body: JSON.stringify({}),
      });
    }
    const accessToken = sessionStorage.getItem('accessToken')
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/game/click`, {} ,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }); // 필요한 데이터 추가 가능
      console.log("POST response:", response.data);
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
    // try {
    //   await fetchClick(); // fetchClick 사용
    // } catch (error) {
    //   console.error("클릭 요청 실패", error);
    // }
  };

  return (
    <>
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* 테두리가 회전하는 버튼 */}
        <div
          data-cy="button"
          onClick={handleClick}
          className="absolute w-40 h-40 rounded-full border-2 border-[#00ff88] hover:border-[#ff00ff] transition-colors duration-300 animate-spin-border"
        ></div>

        {/* 고정된 숫자 */}
        <span className="z-10 text-3xl text-[#00ff88] hover:text-[#ff00ff] transition-colors duration-300">
          {count}
        </span>
      </div>
      <style jsx>{`
        @keyframes spinBorder {
          0% {
            transform: rotate(0deg);
            border-color: #00ff88;
          }
          50% {
            border-color: #ff00ff;
          }
          100% {
            transform: rotate(360deg);
            border-color: #00ff88;
          }
        }

        .animate-spin-border {
          animation: spinBorder 2s linear infinite;
        }
      `}</style>
    </>
  );
}
