"use client";

import React, { useState } from "react";
// import { useQuery } from '@tanstack/react-query';
import { PointInfo } from "@/types/point";
// import { fetchPoints } from '@/apis/pointApi';
// import { useAuthStore } from '@/store/userAuthStore';

const pointHistory: PointInfo[] = [
  {
    id: 1,
    type: "charge",
    amount: 5000,
    date: "2024-10-21",
    description: "포인트 충전",
  },
  {
    id: 2,
    type: "use",
    amount: -2000,
    date: "2024-10-22",
    description: "상품 구매",
  },
  {
    id: 3,
    type: "charge",
    amount: 10000,
    date: "2024-10-23",
    description: "포인트 충전",
  },
  {
    id: 4,
    type: "use",
    amount: -3000,
    date: "2024-10-23",
    description: "이벤트 참가",
  },
];

export default function PointList() {
  const [filter, setFilter] = useState<"all" | "charge" | "use">("all");

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
          onClick={() => setFilter("charge")}
          className={`mr-2 px-4 py-2 ${
            filter === "charge"
              ? "bg-white text-black rounded-md"
              : "bg-transparent border rounded-md"
          }`}
        >
          충전 내역
        </button>
        <button
          onClick={() => setFilter("use")}
          className={`px-4 py-2 ${
            filter === "use"
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
          <li key={transaction.id} className={`p-4 border rounded-lg `}>
            <div className="flex justify-between">
              <span>{transaction.description}</span>
              <span
                className={`${
                  transaction.type === "charge"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.amount.toLocaleString()}P
              </span>
            </div>
            <div className="text-sm text-gray-500">{transaction.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
