"use client";

import React, { useState } from "react";
// import { useQuery } from '@tanstack/react-query';
import { PointInfo } from "@/types/point";
// import { fetchPoints } from '@/apis/pointApi';
// import { useAuthStore } from '@/store/userAuthStore';

const pointHistory: PointInfo[] = [
  {
    type: "CHARGING",
    changeCash: 5000,
    resultCash : 5000,
    createdAt: "2024-10-21",
  },
  {
    type: "ITEM",
    changeCash: -2000,
    resultCash : 3000,
    createdAt: "2024-10-22",
  },
  {
    type: "CHARGING",
    changeCash: 10000,
    resultCash : 13000,
    createdAt: "2024-10-23",
  },
  {
    type: "ITEM",
    changeCash: -3000,
    resultCash: 10000,
    createdAt: "2024-10-23",
  },
];

export default function PointList() {
  const [filter, setFilter] = useState<"all" | "CHARGING" | "ITEM">("all");

  // react-query로 데이터 fetching
  // const { data: pointHistory = [], isLoading, error } = useQuery<PointInfo[]>({
  //   queryKey: ['points'],
  //   queryFn: fetchPoints,
  // });

  // if (isLoading) return <div>로딩 중...</div>;
  // if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  // 필터링된 포인트 내역
  const filteredHistory = pointHistory?.filter((transaction) =>
    filter === "all" ? true : transaction.type === filter
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">포인트 내역</h1>

      {/* 필터 버튼들 */}
      <div className="mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`mr-2 px-4 py-2 ${
            filter === "all"
              ? "bg-white text-black rounded-md"
              : "bg-transparent border rounded-md"
          }`}
        >
          전체 내역
        </button>
        <button
          onClick={() => setFilter("CHARGING")}
          className={`mr-2 px-4 py-2 ${
            filter === "CHARGING"
              ? "bg-white text-black rounded-md"
              : "bg-transparent border rounded-md"
          }`}
        >
          충전 내역
        </button>
        <button
          onClick={() => setFilter("ITEM")}
          className={`px-4 py-2 ${
            filter === "ITEM"
              ? "bg-white text-black rounded-md"
              : "bg-transparent border rounded-md"
          }`}
        >
          사용 내역
        </button>
      </div>

      {/* 포인트 내역 리스트 */}
      <ul className="space-y-4">
        {filteredHistory?.map((transaction) => (
          <li key={transaction.type} className={`p-4 border rounded-lg `}>
            <div className="flex justify-between">
              {/* <span>{transaction.description}</span> */}
              <span
                className={`${
                  transaction.type === "CHARGING"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.changeCash.toLocaleString()}P
              </span>
            </div>
            <div className="text-sm text-gray-500">{transaction.createdAt}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
