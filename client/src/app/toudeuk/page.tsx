"use client";

import { useEffect, useState } from "react";
import GameButton from "./components/GameButton";
import { Client, Frame, IFrame, Stomp } from "@stomp/stompjs";
import { RankInfo } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { gameClick } from "@/apis/gameApi";
import SockJS from "sockjs-client";
import CurrentRank from "./components/CurrentRank";
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
    // ! FIXME : 서버 주소 변경 필요
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = Stomp.over(socket);

    const accessToken = sessionStorage.getItem("accessToken");
    // 연결 헤더에 accessToken을 추가합니다.
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    stompClient.connect(
      headers,
      (frame: IFrame) => {
        console.log("Connected: " + frame);

        stompClient.subscribe("/topic/health", (message) => {}, headers);

        stompClient.subscribe(
          "/topic/health",
          (message) => {
            console.log("메시지 health", message.body);
          },
          headers
        );

        stompClient.subscribe(
          "/topic/game",
          (message) => {
            console.log("메시지 Json 파싱", JSON.parse(message.body));
            const data = JSON.parse(message.body);
            setTotalClick(data.totalClick || 0);
            setLatestClicker(data.latestClicker || null);
            setStatus(data.status || null);
            setRanking(data.rank || []);
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
    <div className="items-center h-full w-full overflow-hidden">
      <section className="float-end w-full p-2">
        <HiInformationCircle className="text-gray-300 w-6 h-6" />
      </section>

      {/* 게임 상태에 따른 화면 전환 */}
      {status === "RUNNING" ? (
        <>
          <h2 className="mt-4 text-lg font-semibold text-[#00ff88]">
            마지막 클릭자
          </h2>
          <p>{latestClicker || "No last clicker yet"}</p>
          <CurrentRank rank={myRank} />
          <div
            className="relative flex items-center justify-center w-40 h-40 "
            onClick={handleClick}
          >
            <GameButton totalClick={totalClick} />
          </div>

          <h3 className="mt-4 text-xl font-semibold text-[#00ff88]">랭킹</h3>
          <Ranking ranking={ranking} />
          {/* 게임이 진행 중일 때는 현재 화면을 보여줍니다 */}
          {/* <p>게임이 진행 중입니다.</p> */}
        </>
      ) : (
        <>
          {/* 쿨타임이 남아있을 때는 남은 시간을 보여줍니다 */}
          <p>다음 라운드까지 {remainingTime}초 남았습니다.</p>
        </>
      )}
    </div>
  );
}
