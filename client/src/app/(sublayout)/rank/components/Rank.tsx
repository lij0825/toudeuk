"use client";
import React, { useEffect, useRef, useState } from "react";
import { RankInfo, RanksInfo } from "@/types/rank";
// import { useSwipeable } from "react-swipeable";
import { fetchRank } from '@/apis/rankAPi';
import { useQuery } from '@tanstack/react-query';
import Image from "next/image";

export default function Rank() {
  //   const [currentRankIndex, setCurrentRankIndex] = useState(0);
  // const [ranks, setRanks] = useState<RankInfo[][]>([]);
  // const ranks = [userData, additionalUserData];
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [numberOfItemsToBrighten, setNumberOfItemsToBrighten] = useState(2);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    // setScrollY(window.scrollY);
    if (scrollContainerRef.current) {
      // scrollContainer의 scrollY 위치를 가져옴
      const scrollTop = scrollContainerRef.current.scrollTop;
      setScrollY(scrollTop);

      const newBrightenCount = Math.floor(scrollTop / 100) + 4; // 2개부터 시작
      setNumberOfItemsToBrighten(newBrightenCount);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // const getBrightness = (index: number) => {
  //   const threshold = 100; // 스크롤 위치 기준
  //   const brightnessFactor = Math.max(0, 1 - (scrollY - threshold) / 300); // 밝기 조정 비율
  //   return index >= 3 ? brightnessFactor : 1; // 4위부터 적용
  // };
  const { data: ranks = { gameId: "", rankList: [] } as RanksInfo, isLoading, isError, error } = useQuery<RanksInfo>({
    queryKey: ['ranks'],
    queryFn: fetchRank,
  });

  // 로딩 상태 처리
  if (isLoading) return <div>Loading...</div>;

  // // 에러 상태 처리
  if (isError) return <div>Error: {(error as Error).message}</div>;

  // const isBright = scrollY > 100;
  // const numberOfItemsToBrighten = Math.floor(scrollY / 100) * 1 + 6;

  return (
    <>
      <h2 className="typo-title font-bold mb-8">Rank</h2>


      <div className="flex flex-col items-center justify-center h-full relative overflow-hidden border-0">
        <div className="rounded-lg w-full max-w-2xlm-8">
          {/* 1위에서 3위까지 큰 카드 */}
          <div className="flex justify-center mt-8 rounded-lg mb-4 border-0">
            {/* 2위 카드 */}
            <div
              className="bg-blue-500 text-white p-4 rounded-lg mx-2 shadow-md flex flex-col items-center"
              style={{ width: "180px" }} // 2위 카드 크기 조정
            >
              <h2 className="text-2xl">{ranks.rankList[1]?.rank}위</h2>
              <p className="text-lg">{ranks.rankList[1]?.nickname}</p>
              <p className="text-xl">{ranks.rankList[1]?.clickCount}</p>
            </div>

            {/* 1위 카드 */}
            <div
              className="bg-blue-500 text-white p-5 rounded-lg mx-2 shadow-md flex flex-col items-center"
              style={{ transform: "translateY(-20px)", width: "220px" }} // 1위 카드를 위로 올리고 크기를 조정
            >
              <h2 className="text-3xl">{ranks.rankList[0]?.rank}위</h2>
              <p className="text-lg">{ranks.rankList[0]?.nickname}</p>
              <p className="text-xl">{ranks.rankList[0]?.clickCount}</p>
            </div>

            {/* 3위 카드 */}
            <div
              className="bg-blue-500 text-white p-4 rounded-lg mx-2 shadow-md flex flex-col items-center"
              style={{ width: "180px" }} // 3위 카드 크기 조정
            >
              <h2 className="text-2xl">{ranks.rankList[2]?.rank}위</h2>
              <p className="text-lg">{ranks.rankList[2]?.nickname}</p>
              <p className="text-xl">{ranks.rankList[2]?.clickCount}</p>
            </div>
          </div>
          {/* <div className="flex justify-center rounded-lg mb-4 mt-4">
            {ranks.rankList.slice(0, 3).map((user) => (
              <div
                key={user.rank}
                className={`bg-blue-500 text-white p-4 rounded-lg mx-2 shadow-md flex flex-col items-center ${user.rank === 1 ? 'transform -translate-y-4' : ''}`}
                style={{ width: user.rank === 1 ? "220px" : "180px" }} // 1위 카드 크기 조정
              >
                <h2 className={`text-${user.rank === 1 ? '3xl' : '2xl'}`}>{user.rank}위</h2>
                <p className="text-lg">{user.nickname}</p>
                <p className="text-xl">{user.clickCount}</p>
              </div>
            ))}
          </div> */}

          <div
            ref={scrollContainerRef}
            className="max-h-[580px] overflow-y-auto rounded-lg flex-grow relative scrollbar-hidden">

            <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
              {ranks.rankList.slice(3,).map((user) => (
                <div
                  key={user.rank}
                  className={`relative p-4 rounded-lg shadow-md flex items-center justify-start  
                  ${user.rank < numberOfItemsToBrighten
                      ? "bg-gradient-to-r from-purple-400 to-blue-500 opacity-100"
                      : "bg-gray-200 opacity-70"
                    }`} // 기본 클래스
                  style={{
                    background:
                      "linear-gradient(98deg, rgba(255, 173, 254, 0.50) -18.39%, rgba(0, 51, 255, 0.50) 113.18%)",
                    strokeWidth: "2px",
                    // opacity: getBrightness(index + 3), // 4위부터 밝기 적용
                    transition: "background-color 0.3s ease, opacity 0.3s ease",
                    stroke: "rgba(211, 11, 165, 0.78)",
                    // filter: scrollY > 0 ? `brightness(${1 - scrollY / 1000})` : 'brightness(1)', // 스크롤에 따른 밝기 조절
                    // border: '2px solid rgba(211, 11, 165, 0.78)', // stroke와 유사하게 보이도록 테두리 추가
                  }}
                >
                  <h3 className="text-xl w-12 mr-2 text-center font-bold">
                    {user.rank}
                  </h3>
                  <Image
                    src={user.profileImageUrl}
                    alt={`${user.nickname}의 프로필`}
                    width="40"
                    height="40"
                    className="rounded-full"
                  />
                  <h3 className="text-lg ml-2 font-bold">{user.nickname}</h3>
                  <h2 className="text-xl ml-auto font-bold">{user.clickCount}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
