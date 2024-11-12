"use client";

import { useEffect, useRef, useState } from "react";
import { Client, Frame, IFrame, Stomp } from "@stomp/stompjs";
import { RankInfo } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { gameClick } from "@/apis/gameApi";
import SockJS from "sockjs-client";
import Image from "next/image";
import { HiInformationCircle } from "react-icons/hi";
import { useUserInfoStore } from "@/store/userInfoStore";
import { CurrentRank, GameButton, GameEnd, GameStart, Ranking } from "./components"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Toudeuk() {
  const [totalClick, setTotalClick] = useState<number>(0);
  // const [stompClient, setStompClient] = useState<Client | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  const [latestClicker, setLatestClicker] = useState<string>("");
  const [myRank, setMyRank] = useState<number>(0);
  const [ranking, setRanking] = useState<RankInfo[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [coolTime, setCoolTime] = useState<Date | null>(null);

  //상단바 렌더링을 위한 정보
  const userInfo = useUserInfoStore((state) => state.userInfo);

  const mutation = useMutation({
    mutationFn: () => gameClick(),
    onSuccess: (data) => {
      setMyRank(data.myRank);
      console.log(data);
    },
  });

  useEffect(() => {
    console.log(userInfo?.nickName)
    if(stompClientRef.current) return;
    
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = Stomp.over(() => socket);
    stompClientRef.current = stompClient;
    

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
            console.log(data)
            setTotalClick(data.totalClick || 0);
            setLatestClicker(data.latestClicker || null);
            setStatus(data.status || null);
            setRanking(data.rank || []);

            const myRankIndex = data.rank.findIndex(
              (rankInfo: RankInfo) => rankInfo.nickname === userInfo?.nickName
            );
        
            // 순위는 배열 인덱스가 0부터 시작하므로, myRank는 +1을 해야 합니다.
            setMyRank(myRankIndex >= 0 ? myRankIndex + 1 : 0);

            const coolTimeDate = new Date(data.coolTime);
            setCoolTime(coolTimeDate || null);
          },
          headers
        );
      },
      (error: Frame | string) => {
        console.error("Connection error: ", error);
      }
    );

    // setStompClient(stompClient);

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, []);

  const handleClick = async () => {
    if (stompClientRef.current) {
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
            <div className="flex-grow flex text-white">
              <div>
                {userInfo ? (
                  <div className="w-6 h-6 overflow-hidden rounded-full mr-2">
                    <Image
                      src={userInfo.profileImg}
                      width={30}
                      height={30}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <Image
                    src="/default_profile.jpg"
                    width={50}
                    height={50}
                    alt="Profile"
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="font-bold">
              내 현재 랭킹 {myRank}
              </div>
            </div>
            <div className="flex-grow flex text-white">
              <div className="font-semibold mr-2">
              마지막 클릭자 
              </div>
              <div>
              {latestClicker || "클릭자가 없습니다"}
              </div>
            </div>
          
          </section>
          {/* 내용 섹션 */}
          <div className="flex flex-col items-center justify-center h-full relative">
          <div className="text-gray-400 absolute left-4 top-4">
              <HiInformationCircle className="w-[32px] h-[32px]" />
            </div>
            {/* 랭킹 */}
            <section className="absolute right-4 top-4 h-full z-0 overflow-y-auto scrollbar-hidden">
              <h3 className="text-md font-extrabold font-noto text-white mb-2 w-full text-center">
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
