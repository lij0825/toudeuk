"use client";
import React, { useEffect, useState } from "react";
import { RankInfo } from "@/types/rankInfo";
import { useSwipeable } from "react-swipeable";
// import { fetchRank } from '@/apis/rankAPi';
// import { useQuery } from '@tanstack/react-query';
import Image from "next/image";

const userData: RankInfo[] = [
  {
    rank: 1,
    username: "UserOne",
    clicks: 1500,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 2,
    username: "UserTwo",
    clicks: 1200,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 3,
    username: "UserThree",
    clicks: 1000,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 4,
    username: "UserFour",
    clicks: 800,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 5,
    username: "UserFive",
    clicks: 600,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 6,
    username: "UserSix",
    clicks: 600,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 7,
    username: "UserSeven",
    clicks: 600,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 8,
    username: "UserEight",
    clicks: 600,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 9,
    username: "UserNine",
    clicks: 600,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 10,
    username: "UserTen",
    clicks: 600,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 11,
    username: "UserEleven",
    clicks: 50,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 12,
    username: "UserTwelve",
    clicks: 40,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 13,
    username: "UserThirteen",
    clicks: 30,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 14,
    username: "UserFourteen",
    clicks: 20,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
  {
    rank: 15,
    username: "UserFifteen",
    clicks: 10,
    image: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
  },
];

const additionalUserData: RankInfo[] = [];

export default function Rank() {
  const [currentRankIndex, setCurrentRankIndex] = useState(0);
  // const [ranks, setRanks] = useState<RankInfo[][]>([]);
  const ranks = [userData, additionalUserData];

  const [scrollY, setScrollY] = useState(0);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // const { data: ranks = [], isLoading, isError, error } = useQuery<RankInfo[]>({
  //     queryKey: ['ranks'], // 캐싱 키 설정
  //     queryFn: fetchRank,     // 데이터를 가져오는 함수
  //     // onSuccess: (data) => {
  //     //     console.log(data); // 성공적으로 데이터를 가져오면 콘솔에 출력
  //     // },
  // });

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentRankIndex((prevIndex) => (prevIndex + 1) % ranks.length);
    },
    onSwipedRight: () => {
      setCurrentRankIndex(
        (prevIndex) => (prevIndex - 1 + ranks.length) % ranks.length
      );
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // 로딩 상태 처리
  // if (isLoading) return <div>Loading...</div>;

  // // 에러 상태 처리
  // if (isError) return <div>Error: {(error as Error).message}</div>;

  // const isBright = scrollY > 100;
  const numberOfItemsToBrighten = Math.floor(scrollY / 100) + 6;

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="typo-title font-bold mb-6">Rank</h2>
        {/* 1위에서 3위까지 큰 카드 */}
        <div className="flex justify-center mb-4">
          <div
            className="bg-blue-500 text-white p-4 rounded-lg mx-2 shadow-md flex flex-col items-center"
            style={{ width: "180px" }} // 2위 카드 크기 조정
          >
            <h2 className="text-2xl">2위</h2>
            <p className="text-lg">UserTwo</p>
            <p className="text-xl">1200</p>
          </div>
          <div
            className="bg-blue-500 text-white p-5 rounded-lg mx-2 shadow-md flex flex-col items-center"
            style={{ transform: "translateY(-20px)", width: "220px" }} // 1위 카드를 위로 올리고 크기를 조정
          >
            <h2 className="text-3xl">1위</h2>
            <p className="text-lg">UserOne</p>
            <p className="text-xl">1500</p>
          </div>
          <div
            className="bg-blue-500 text-white p-4 rounded-lg mx-2 shadow-md flex flex-col items-center"
            style={{ width: "180px" }} // 3위 카드 크기 조정
          >
            <h2 className="text-2xl">3위</h2>
            <p className="text-lg">UserThree</p>
            <p className="text-xl">1000</p>
          </div>
        </div>
        {/* <div className="flex justify-center mb-4">
                    {ranks[0].slice(0, 3).map((user) => (
                        <div
                        key={user.rank}
                        className="bg-blue-500 text-white p-4 rounded-lg mx-2 shadow-md flex flex-col items-center" // 카드 높이 줄이기 위해 padding을 줄임
                        >
                        <h2 className="text-2xl">{user.rank}</h2>
                        <p className="text-lg">{user.username}</p>
                        <p className="text-sm">{user.clicks}</p>
                        </div>
                        ))}
                        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {ranks[0].slice(3).map((user, index) => (
            <div
              key={user.rank}
              className={`relative p-4 rounded-lg shadow-md flex items-center justify-start  ${
                index + 4 < numberOfItemsToBrighten
                  ? "bg-gradient-to-r from-purple-400 to-blue-500 opacity-100"
                  : "bg-gray-200 opacity-70"
              }`} // 기본 클래스
              style={{
                background:
                  "linear-gradient(98deg, rgba(255, 173, 254, 0.50) -18.39%, rgba(0, 51, 255, 0.50) 113.18%)",
                strokeWidth: "2px",
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
                src={user.image}
                alt={`${user.username}의 프로필`}
                width="40"
                height="40"
                className="rounded-full"
              />
              <h3 className="text-lg ml-2 font-bold">{user.username}</h3>
              <h2 className="text-xl ml-auto font-bold">{user.clicks}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
