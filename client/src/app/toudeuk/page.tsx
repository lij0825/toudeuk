"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import Image from "next/image";
import { Client, Frame, IFrame, Stomp } from "@stomp/stompjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { gameClick } from "@/apis/gameApi";
import { useUserInfoStore } from "@/store/userInfoStore";
import { HistoryRewardInfo, RankInfo } from "@/types";
import { GameButton, Ranking, StartGame, EndGame } from "./components";
import { fetchGameRewardHistory } from "@/apis/history/rewardhistory";
import ChristmasHeader from "./components/Header";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Toudeuk() {
  const [totalClick, setTotalClick] = useState<number>(0);
  const stompClientRef = useRef<Client | null>(null);

  const [latestClicker, setLatestClicker] = useState<string>("");
  const [myRank, setMyRank] = useState<number>(0);
  const [ranking, setRanking] = useState<RankInfo[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [coolTime, setCoolTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [remainingMilliseconds, setRemainingMilliseconds] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentGameId, setCurrentGameId] = useState<number>(0);

  const [showGameStart, setShowGameStart] = useState<boolean>(false);

  const [showRewardGif, setShowRewardGif] = useState<boolean>(false);
  const [rewardGifSrc, setRewardGifSrc] = useState<string>("");

  //상단바 렌더링을 위한 정보
  const userInfo = useUserInfoStore((state) => state.userInfo);

  const gameId = Number(sessionStorage.getItem("gameId"));

  //클릭시 당첨 로직
  const mutation = useMutation({
    mutationFn: () => gameClick(),
    onSuccess: (data) => {
      console.log(data.myClickCount);
      setMyRank(data.myRank);
      // rewardType이 "SECTION"일 경우 toast 띄우기
      if (data.rewardType === "SECTION") {
        setShowRewardGif(true);
        setRewardGifSrc("/icons/Firecracker.gif");
        toast.success(`당첨되었습니다! 🎉`, {
          position: "top-center",
          autoClose: 3000, // 3초 후 자동으로 사라짐
          hideProgressBar: true, // 진행 바 숨김
          closeOnClick: true, // 클릭 시 닫기
        });
        setTimeout(() => setShowRewardGif(false), 3000);
      } else if (data.rewardType === "FIRST") {
        setShowRewardGif(true);
        setRewardGifSrc("/icons/Firecracker1.gif");
        toast.success(`첫번째 클릭자로 당첨되었습니다! 🎉`, {
          position: "top-center",
          autoClose: 3000, // 3초 후 자동으로 사라짐
          hideProgressBar: true, // 진행 바 숨김
          closeOnClick: true, // 클릭 시 닫기
        });
        setTimeout(() => setShowRewardGif(false), 3000);
      } else if (data.rewardType === "WINNER") {
        setShowRewardGif(true);
        setRewardGifSrc("/icons/Firecracker2.gif");
        toast.success(`마지막 클릭자로 당첨되었습니다!`, {
          position: "top-center",
          autoClose: 5000, // 5초 후 자동으로 사라짐
          hideProgressBar: true, // 진행 바 숨김
          closeOnClick: true, // 클릭 시 닫기
        });
        setTimeout(() => setShowRewardGif(false), 5000);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const {
    data: reward,
    isLoading,
    error,
  } = useQuery<HistoryRewardInfo>({
    queryKey: ["reward", gameId],
    queryFn: () => fetchGameRewardHistory(gameId),
    enabled: status === "COOLTIME",
  });

  useEffect(() => {
    if (coolTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeLeft = coolTime.getTime() - now.getTime();
        if (timeLeft <= 0) {
          setRemainingTime(0);
          setRemainingMilliseconds(0);
          setShowPopup(false);
          setShowGameStart(false);
          clearInterval(interval);
        } else if (timeLeft > 0 && timeLeft <= 10000) {
          const secondsLeft = Math.floor(timeLeft / 1000);
          setRemainingTime(secondsLeft);
          setShowPopup(false);
          setShowGameStart(true);
          setTimeout(() => setShowGameStart(false), 10000);
        } else {
          const secondsLeft = Math.floor(timeLeft / 1000);
          const millisecondsLeft = timeLeft % 1000;
          setRemainingTime(secondsLeft);
          setRemainingMilliseconds(millisecondsLeft);
          setShowPopup(true);
          setShowGameStart(false);
        }
      }, 10); // 10ms마다 업데이트

      return () => clearInterval(interval);
    }
  }, [coolTime]);

  useEffect(() => {
    if (stompClientRef.current) return;

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
        // console.log("Connected: " + frame);

        stompClient.subscribe("/topic/health", (message) => {}, headers);

        stompClient.subscribe(
          "/topic/game",
          (message) => {
            const data = JSON.parse(message.body);
            // console.log(data);
            setTotalClick(data.totalClick || 0);
            setLatestClicker(data.latestClicker || null);
            setStatus(data.status || null);
            setRanking(data.rank || []);
            if (data.gameId !== null && data.gameId != 0) {
              sessionStorage.setItem("gameId", data.gameId);
              setCurrentGameId(data.gameId);
            }
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

  return (
    <div className="items-center flex flex-col relative h-full w-full overflow-hidden font-noto">
      <ChristmasHeader
        userInfo={userInfo}
        myRank={myRank}
        latestClicker={latestClicker}
      />

      <section className="relative flex flex-col flex-grow items-center justify-center h-full w-full bg-gradient-to-b from-[#131f3c] via-[#091f3e] to-[#070e1d]">
        <div className="absolute top-2 left-4 text-gray-400 flex">게임소개</div>
        {/* 랭킹 */}
        <section className="absolute right-2 top-2 h-full z-0 overflow-y-auto scrollbar-hidden">
          <Ranking ranking={ranking} />
        </section>
        {/* 버튼 */}
        <section
          className="w-96 h-96 z-50 flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onClick={handleClick}
          style={{ zIndex: 10 }}
        >
          {showRewardGif && (
            <Image
              src={rewardGifSrc}
              alt="Congratulations"
              className="absolute w-full h-full object-cover"
              width={100}
              height={100}
              style={{ zIndex: 9 }}
            />
          )}
          <GameButton totalClick={totalClick} />
        </section>
      </section>

      {showPopup && reward && (
        <EndGame
          remainingTime={remainingTime}
          remainingMilliseconds={remainingMilliseconds}
          reward={reward}
        />
      )}
      {showGameStart && <StartGame remainingTime={remainingTime} />}
    </div>
  );
}
