"use client";

import { useEffect, useRef, useState } from "react";
import { Client, Frame, IFrame, Stomp } from "@stomp/stompjs";
import { HistoryRewardInfo, RankInfo } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { gameClick } from "@/apis/gameApi";
import SockJS from "sockjs-client";
import Image from "next/image";
import { HiInformationCircle } from "react-icons/hi";
import { useUserInfoStore } from "@/store/userInfoStore";
import { CurrentRank, GameButton, GameEnd, GameStart, Ranking } from "./components";
import { toast } from "react-toastify";
import { fetchGameRewardHistory } from "@/apis/history/rewardhistory";

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
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [remainingMilliseconds, setRemainingMilliseconds] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentGameId, setCurrentGameId] = useState<number>(0);

  //상단바 렌더링을 위한 정보
  const userInfo = useUserInfoStore((state) => state.userInfo);

  const gameId = Number(sessionStorage.getItem("gameId"))

  const mutation = useMutation({
    mutationFn: () => gameClick(),
    onSuccess: (data) => {
      setMyRank(data.myRank);
      console.log(data);
      console.log(currentGameId)
      // rewardType이 "SECTION"일 경우 toast 띄우기
      if (data.rewardType === "SECTION") {
        toast.success(`당첨되었습니다! 🎉`, {
          autoClose: 3000,  // 3초 후 자동으로 사라짐
          hideProgressBar: true,  // 진행 바 숨김
          closeOnClick: true,  // 클릭 시 닫기
        });
      } else if (data.rewardType === "FIRST") {
        toast.success(`첫번째 클릭자로 당첨되었습니다! 🎉`, {
          autoClose: 3000,  // 3초 후 자동으로 사라짐
          hideProgressBar: true,  // 진행 바 숨김
          closeOnClick: true,  // 클릭 시 닫기
        });
      }

    },
  });

  const { data: reward, isLoading, error } = useQuery<HistoryRewardInfo>({
    queryKey: ['reward', gameId],
    queryFn: () => fetchGameRewardHistory(gameId),
    enabled: status === 'COOLTIME',
  })

  useEffect(() => {
    if (coolTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeLeft = coolTime.getTime() - now.getTime();

        if (timeLeft <= 0) {
          setRemainingTime(0);
          setRemainingMilliseconds(0);
          setShowPopup(false);
          clearInterval(interval);
        } else {
          const secondsLeft = Math.floor(timeLeft / 1000);
          const millisecondsLeft = timeLeft % 1000;

          setRemainingTime(secondsLeft);
          setRemainingMilliseconds(millisecondsLeft);
          setShowPopup(true);
        }
      }, 10); // 10ms마다 업데이트

      return () => clearInterval(interval);
    }
  }, [coolTime])

  useEffect(() => {
    console.log('현재라운드', currentGameId)
    console.log(userInfo?.nickName)
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
        console.log("Connected: " + frame);

        stompClient.subscribe("/topic/health", (message) => { }, headers);

        stompClient.subscribe(
          "/topic/game",
          (message) => {
            const data = JSON.parse(message.body);
            console.log(data)
            setTotalClick(data.totalClick || 0);
            setLatestClicker(data.latestClicker || null);
            setStatus(data.status || null);
            setRanking(data.rank || []);
            if (data.gameId !== null && data.gameId != 0) {
              sessionStorage.setItem("gameId", data.gameId)
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

  useEffect(() => {
    if (reward) {
      setShowPopup(true);
    }
  }, [reward]);

  // const remainingTime = coolTime
  //   ? Math.max(0, Math.floor((coolTime.getTime() - new Date().getTime()) / 1000))
  //   : 0;

  return (
    <div className="items-center relative h-full w-full overflow-hidden font-noto bg-[#031926]">
      {/* {status === "RUNNING" ? ( */}
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
            <div className="font-bold">내 현재 랭킹 {myRank}</div>
          </div>
          <div className="flex-grow flex text-white">
            <div className="font-semibold mr-2">마지막 클릭자</div>
            <div>{latestClicker === "NONE" ? "-" : latestClicker || "클릭자가 없습니다"}</div>
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
            style={{ zIndex: 10 }}
          >
            <GameButton totalClick={totalClick} />
          </section>
        </div>
        {showPopup && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm" style={{ zIndex: 100 }}>
            <div className="bg-white p-5 rounded-lg text-center">
              <p className="text-black">
                다음 라운드까지
              </p>
              <p className="text-black text-xl">
                {remainingTime} 초 {remainingMilliseconds}
              </p>
              {reward && (
                <>
                  <p>{gameId}라운드</p>
                  <p>최다 클릭자 : {reward?.maxClicker?.nickname}</p>
                  <p>마지막 클릭자 : {reward?.winner?.nickname}</p>
                  <p>중간 보상자</p>
                  <ul>
                    <li>첫번째 클릭자 : {reward?.firstClicker?.nickname}</li>
                    {reward?.middleRewardUsers?.map((user, index) => (
                      <li key={index}>
                        {user.clickCount}번째 클릭자 : {user.nickname}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </>
      {/* // ) : (
      //   <p className="text-white">
      //     다음 라운드까지 {remainingTime}초 {remainingMilliseconds}ms 남았습니다.
      //   </p>
      // )} */}
    </div>
  );
}
