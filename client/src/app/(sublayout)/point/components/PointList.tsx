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
  const filteredHistory = pointHistory?.filter((transaction) =>
    filter === "all" ? true : transaction.type === filter
  );

  // const handleFilterClick = (type: "all" | "CHARGING" | "GAME" | "REWARD" | "ITEM") => {
  //   setFilter((prev) => {
  //     if (type === "all") return ["all"]; // 전체 내역 클릭 시 모든 필터 초기화
  //     if (prev.includes(type)) {
  //       return prev.filter(f => f !== type); // 이미 포함되어 있으면 제거
  //     } else {
  //       return [...prev, type]; // 포함되어 있지 않으면 추가
  //     }
  //   });
  // };

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

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">포인트 내역</h1>
      {/* 필터 버튼들 */}
      <div className="mb-4 flex">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 flex-1 ${filter === "all" ? "bg-white text-black" : "bg-transparent border border-gray-300"
            }`}
        >
          ALL
        </button>
        <button
          onClick={() => setFilter("CHARGING")}
          className={`px-4 py-2 flex-1 ${filter === "CHARGING" ? "bg-white text-black" : "bg-transparent border border-gray-300"
            }`}
        >
          CHARGE
        </button>
        <button
          onClick={() => setFilter("REWARD")}
          className={`px-4 py-2 flex-1 ${filter === "REWARD" ? "bg-white text-black" : "bg-transparent border border-gray-300"
            }`}
        >
          REWARD
        </button>
        <button
          onClick={() => setFilter("ITEM")}
          className={`px-4 py-2 flex-1 ${filter === "ITEM" ? "bg-white text-black" : "bg-transparent border border-gray-300"
            }`}
        >
          USE
        </button>
      </div>

      {/* 포인트 내역 리스트 */}
      <div
        className="max-h-[460px] overflow-y-auto flex-grow relative scrollbar-hidden">
        <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
          <ul className="space-y-4">
            {filteredHistory?.map((transaction) => (
              <li key={transaction.createdAt} className={`p-4 border rounded-lg `}>
                <div className="flex justify-between">
                  {/* <span>{transaction.description}</span> */}
                  <span
                    className={`${transaction.type === "CHARGING"
                      ? "text-white-500"
                      : "text-gray-500"
                      }`}
                  >
                    {transaction.changeCash.toLocaleString()}P
                  </span>
                </div>
                <div className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
