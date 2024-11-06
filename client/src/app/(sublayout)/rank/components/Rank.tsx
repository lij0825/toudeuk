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
      <div className="flex items-center justify-between">
        <h2 className="typo-title font-bold">Rank</h2>
        <Image
          src="/icons/crown_top.png"
          alt="랭킹 아이콘"
          width="50"
          height="50"
        />
      </div>

      {ranks.rankList.length === 0 ? (
        <div className="mt-4">진행중인 라운드가 존재하지 않습니다.</div>
      ) : (
        <div className="flex flex-col mt-4 items-center justify-center h-full relative overflow-hidden border-0">
          <div className="rounded-lg w-full max-w-2xlm-8">
            {/* 1위에서 3위까지 큰 카드 */}
            <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
              {ranks.rankList.slice(0, 3).map((user) => (
                <div
                  key={user.rank}
                  className={`relative p-4 rounded-lg shadow-md flex items-center justify-start`} // 기본 클래스
                  style={{
                    background:
                      "linear-gradient(98deg, rgba(255, 173, 254, 0.50) -18.39%, rgba(0, 51, 255, 0.50) 113.18%)",
                    strokeWidth: "2px",
                    transition: "background-color 0.3s ease, opacity 0.3s ease",
                    stroke: "rgba(211, 11, 165, 0.78)",
                  }}
                >
                  {/* Rank 1, 2, 3에 따라 다르게 아이콘을 설정 */}
                  <h3 className="text-xl text-center font-bold -m-6">
                    {user.rank === 1 && (
                      <Image
                        src="/icons/Number1.gif" // 1위 아이콘
                        alt="1위 아이콘"
                        width="100"
                        height="100"
                      />
                    )}
                    {user.rank === 2 && (
                      <Image
                        src="/icons/Number2.gif" // 2위 아이콘
                        alt="2위 아이콘"
                        width="100"
                        height="100"
                      />
                    )}
                    {user.rank === 3 && (
                      <Image
                        src="/icons/Number3.gif" // 3위 아이콘
                        alt="3위 아이콘"
                        width="100"
                        height="100"
                      />
                    )}
                  </h3>
                  <Image
                    src={user.profileImageUrl}
                    alt={`${user.nickname}의 프로필`}
                    width="40"
                    height="40"
                    className="rounded-full ml-1"
                  />
                  <h3 className="text-lg ml-2 font-bold">{user.nickname}</h3>
                  <h2 className="text-xl ml-auto font-bold">{user.clickCount}</h2>
                </div>
              ))}
            </div>
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
      )}
    </>
  );
}

