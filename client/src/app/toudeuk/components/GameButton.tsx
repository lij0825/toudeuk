"use client";

import { gameClick } from "@/apis/gameApi";
import { GameInfo } from "@/types/game";
//소켓 연결 또는 SSE 방식으로 touch값 fetch
import { Client, Frame, IFrame, Message, Stomp } from "@stomp/stompjs";
// import axios from "axios";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { useMutation, useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function GameButton() {
  const [count, setCount] = useState<number>(0);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const { data: totalClick , isLoading, error } = useQuery<GameInfo>({
    queryKey: ['count'],
    queryFn: gameClick
  })

  const mutate = useMutation<GameInfo>({
    mutationFn: () => gameClick(),
    onSuccess: (data) => {
      // setCount(data.totalClick);
    },
    onError: (error) => {
      console.error("Error updating count:", error);
    },
  });

  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    mutate.mutate();
    // accessToken을 sessionStorage에서 가져옵니다.

    // ! FIXME : 서버 주소 변경 필요
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = Stomp.over(socket);

    // 연결 헤더에 accessToken을 추가합니다.
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    stompClient.connect(
      headers,
      (frame: IFrame) => {
        console.log("Connected: " + frame);

        stompClient.publish({
          destination: "/topic/game",
          body: JSON.stringify({}),
          headers: headers,
        });

        stompClient.subscribe(
          "/topic/game",
          (message) => {
            console.log("메시지 전체", message);
            console.log("메시지 전체", message);
            console.log("메시지 body", message.body);
            console.log("메시지 Json 파싱", JSON.parse(message.body));
            setCount(parseInt(JSON.parse(message.body)["totalClick"]));
          },
          headers
        );
        // stompClient.subscribe(`/topic/game/${userId}`,(message:IMessage) => {
        //   console.log("내 클릭 수 : ",message)
        // })
      },
      (error: Frame | string) => {
        console.error("Connection error: ", error);
      }
    );

    setStompClient(stompClient);

    // Cleanup on unmount
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);
    
  const handleClick = async () => {
    // gameClick()
    mutate.mutate();

    if (stompClient) {
      const accessToken = sessionStorage.getItem("accessToken");
      stompClient.publish({
        destination: "/topic/game",
        body: JSON.stringify({}),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    // const accessToken = sessionStorage.getItem("accessToken");
    // try {
    //   const response = await axios.post(`${BASE_URL}/api/v1/game/click`, {} ,{
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${accessToken}`
    //     }
    //   }); // 필요한 데이터 추가 가능
    //   console.log("POST response:", response.data);
    // } catch (error) {
    //   console.error("Error sending POST request:", error);
    // }
    // try {
    //   await fetchClick(); // fetchClick 사용
    // } catch (error) {
    //   console.error("클릭 요청 실패", error);
    // }
  };

  if (mutate !== undefined) {
    console.log("111=====================================");
    console.log("data: ", mutate.data);
    console.log("222=====================================");
  }

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
