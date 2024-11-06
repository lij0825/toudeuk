"use client";

import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { PointInfo } from "@/types/point";
import { fetchPoints } from '@/apis/pointApi';
// import { useAuthStore } from '@/store/userAuthStore';

export default function PointList() {
  const [filter, setFilter] = useState<"all" | "CHARGING" | "GAME" | "REWARD" | "ITEM">("all");

  // react-query로 데이터 fetching
  const { data: pointHistory = [], isLoading, error } = useQuery<PointInfo[]>({
    queryKey: ['points'],
    queryFn: fetchPoints,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  // 필터링된 포인트 내역
  const filteredHistory = pointHistory?.filter((transaction) => {
    if (filter === "all") return true;
    if (filter === "ITEM") return transaction.type === "ITEM" || transaction.type === "GAME";
    return transaction.type === filter;
  })
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // 최신순 정렬

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).replace(/\./g, "").replace(/\s/g, " ");
  };

  const getTypeInKorean = (type: string) => {
    switch (type) {
      case "CHARGING":
        return "충전";
      case "REWARD":
        return "보상";
      case "ITEM":
        return "구매";
      case "GAME":
        return "게임";
      default:
        return type; // 기본값으로 원래 타입을 반환
    }
  };

  return (
    <div className="mx-auto w-full">
      <h1 className="text-2xl pl-4 pt-4 font-bold mb-4">포인트 내역</h1>
      {/* 필터 버튼들 */}
      <div className="mb-4 flex w-full overflow-hidden">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-2 flex-1 border-b-2 ${filter === "all" ? "text-black border-black" : "text-gray-500 border-gray-300"
            }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("CHARGING")}
          className={`px-3 py-2 flex-1 border-b-2 ${filter === "CHARGING" ? "text-black border-black" : "text-gray-500 border-gray-300"
            }`}
        >
          충전
        </button>
        <button
          onClick={() => setFilter("REWARD")}
          className={`px-3 py-2 flex-1 border-b-2 ${filter === "REWARD" ? "text-black border-black" : "text-gray-500 border-gray-300"
            }`}
        >
          보상
        </button>
        <button
          onClick={() => setFilter("ITEM")}
          className={`px-3 py-2 flex-1 border-b-2 ${filter === "ITEM" ? "text-black border-black" : "text-gray-500 border-gray-300"
            }`}
        >
          사용
        </button>
      </div>

      {/* 포인트 내역 리스트 */}
      <div
        className="max-h-[460px] overflow-y-auto flex-grow relative w-full scrollbar-hidden box-border">
        {/* <div className="grid grid-cols-1 gap-4 w-full max-w-2xl"> */}
          <ul className="space-y-4 w-full">
            {filteredHistory?.map((transaction) => (
              <li key={transaction.createdAt} className={`p-4 border shadow-md rounded-lg `}>
                <div className="flex justify-between">
                  {/* <span>{transaction.description}</span> */}
                  <span
                    className={`${transaction.type === "CHARGING"
                      ? "text-red-500"
                      : "text-blue-500"
                      }`}
                  >
                    {transaction.changeCash.toLocaleString()}P
                  </span>
                  <span className="text-gray-500 ml-4">{getTypeInKorean(transaction.type)}</span>
                </div>
                <div className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</div>
              </li>
            ))}
          </ul>
        {/* </div> */}
      </div>
    </div>
  );
}
