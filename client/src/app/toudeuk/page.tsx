"use client";

import { useEffect, useState } from "react";
import GameButton from "./components/GameButton";
import { Client, Frame, IFrame, Stomp } from "@stomp/stompjs";
import { RankInfo } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { gameClick } from "@/apis/gameApi";
import SockJS from "sockjs-client";
import Ranking from "./components/Ranking";
import { HiInformationCircle } from "react-icons/hi";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Toudeuk() {
  const [totalClick, setTotalClick] = useState<number>(0);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const [latestClicker, setLatestClicker] = useState<string>("");
  const [myRank, setMyRank] = useState<number>(0);
  const [ranking, setRanking] = useState<RankInfo[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [coolTime, setCoolTime] = useState<Date | null>(null);

  const mutation = useMutation({
    mutationFn: () => gameClick(),
    onSuccess: (data) => {
      setMyRank(data.myRank);
      console.log(data);
    },
  });

  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = Stomp.over(socket);

    const accessToken = sessionStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    stompClient.connect(
      headers,
      (frame: IFrame) => {
        console.log("Connected: " + frame);

        stompClient.subscribe("/topic/health", (message) => {}, headers);

        stompClient.subscribe(
          "/topic/game",
          (message) => {
            const data = JSON.parse(message.body);
            setTotalClick(data.totalClick || 0);
            setLatestClicker(data.latestClicker || null);
            setStatus(data.status || null);
            setRanking(data.rank || []);

            const coolTimeDate = new Date(data.coolTime);
            setCoolTime(data.coolTime || null);
          },
          headers
        );
      },
      (error: Frame | string) => {
        console.error("Connection error: ", error);
      }
    );

    setStompClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const handleClick = async () => {
    if (stompClient) {
      mutation.mutate();
    }
  };

  const remainingTime = coolTime
    ? Math.max(
        0,
        Math.floor((coolTime.getTime() - new Date().getTime()) / 1000)
      )
    : 0;

  return (
    <div className="items-center relative h-full w-full overflow-hidden font-noto bg-[#031926]">
      {status === "RUNNING" ? (
         <>
        {/* 최상단 섹션 */}
          <section className="w-full flex justify-center items-center bg-black p-5">
            <div className="flex-grow text-white">현재 내 순위 : {myRank}</div>
            <div className="flex-grow text-white">
              마지막 클릭자 {latestClicker || "클릭자가 없습니다"}
            </div>
            <div className="text-gray-400">
              <HiInformationCircle className="w-[24px] h-[24px]" />
            </div>
          </section>
          {/* 내용 섹션 */}
          <div className="flex flex-col items-center justify-center h-full relative">
            {/* 랭킹 */}
            <section className="absolute left-4 top-4 h-full z-0 overflow-y-auto scrollbar-hidden">
              <h3 className="text-xl font-extrabold font-noto text-white mb-2">
                실시간 랭킹
              </h3>
              <Ranking ranking={ranking} />
            </section>

            {/* 버튼 */}
            <section
              className="w-40 h-40 z-50 flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              onClick={handleClick}
            >
              <GameButton totalClick={totalClick} />
            </section>
          </div>
        </>
      ) : (
        <p>다음 라운드까지 {remainingTime}초 남았습니다.</p>
      )}
    </div>
  );
}
