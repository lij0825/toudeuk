"use client";

import { gameClick } from "@/apis/gameApi";
import { GameInfo } from "@/types/game";
import { Client, Frame, IFrame, Stomp, StompHeaders } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GameButton() {
  const [count, setCount] = useState<number>(0);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const accessToken = sessionStorage.getItem("accessToken");
  // const socket = new SockJS(`${BASE_URL}/ws`);
  // console.log("Initialized SockJS socket:", socket); // SockJS 초기화 확인

  useEffect(() => {
    console.log("useEffect triggered"); // useEffect 시작 확인
    const stompClient = Stomp.over(() => new SockJS(`${BASE_URL}/ws`)); //재연결 기능을 사용할 수 있음.
    // const stompClient = Stomp.over(socket);
    console.log("Initialized Stomp client:", stompClient); // Stomp 클라이언트 초기화 확인

    const headers: StompHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };
    console.log("Headers set for connection:", headers); // 헤더 설정 확인

    stompClient.connect(
      headers,
      (frame: IFrame) => {
        console.log("Connected to STOMP broker:", frame); // STOMP 연결 성공

        stompClient.publish({
          destination: "/topic/connect",
          body: JSON.stringify({}),
          headers: headers,
        });
        console.log("Published to /topic/connect"); // /topic/connect 발행 확인

        stompClient.subscribe(
          "/topic/game",
          (message) => {
            console.log("Received message on /topic/game:", message); // 수신된 전체 메시지 확인
            console.log("Message body:", message.body); // 메시지 본문 확인

            const parsedData = JSON.parse(message.body);
            console.log("Parsed message data:", parsedData); // 메시지 파싱 후 데이터 확인

            setCount(parseInt(parsedData["totalClick"]));
          },
          headers
        );
        console.log("Subscribed to /topic/game"); // /topic/game 구독 확인
      },
      (error: Frame | string) => {
        console.error("Connection error:", error); // 연결 실패 시 에러 확인
      }
    );

    setStompClient(stompClient);
    console.log("Stomp client set in state:", stompClient); // Stomp 클라이언트 설정 확인

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected from STOMP broker"); // 연결 해제 확인
        });
      }
    };
  }, []);

  const handleClick = async () => {
    console.log("Button clicked"); // 버튼 클릭 확인
    if (stompClient) {
      stompClient.publish({
        destination: "/topic/game",
        body: JSON.stringify({}),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Published to /topic/game on click"); // 클릭 시 /topic/game 발행 확인
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center w-40 h-40">
        <div
          data-cy="button"
          onClick={handleClick}
          className="absolute w-40 h-40 rounded-full border-2 border-[#00ff88] hover:border-[#ff00ff] transition-colors duration-300 animate-spin-border"
        ></div>
        <span className="z-10 text-3xl text-white">{count}</span>
      </div>
    </>
  );
}
