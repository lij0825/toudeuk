"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PointInfo } from "@/types/point";
import { fetchPoints } from "@/apis/pointApi";

export default function PointList() {
  const [filter, setFilter] = useState<
    "all" | "CHARGING" | "GAME" | "REWARD" | "ITEM"
  >("all");

  const {
    data: pointHistory = [],
    isLoading,
    error,
  } = useQuery<PointInfo[]>({
    queryKey: ["points"],
    queryFn: fetchPoints,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  const filteredHistory = pointHistory
    .filter((transaction) => {
      if (filter === "all") return true;
      if (filter === "ITEM")
        return transaction.type === "ITEM" || transaction.type === "GAME";
      return transaction.type === filter;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\./g, "")
      .replace(/\s/g, " ");
  };

  const getTypeInKorean = (type: string) => {
    switch (type) {
      case "CHARGING":
        return { text: "충전", color: "text-green-500" };
      case "REWARD":
        return { text: "보상", color: "text-blue-500" };
      case "ITEM":
        return { text: "구매", color: "text-red-500" };
      case "GAME":
        return { text: "게임", color: "text-orange-500" };
      default:
        return { text: type, color: "text-black" };
    }
  };

  return (
    <div className="mx-auto w-full h-screen flex flex-col font-noto">
      <h1 className="flex flex-col text-xl pt-4 font-bold mb-4">포인트 내역</h1>

      {/* Filter buttons */}
      <div className="mb-4 flex-shrink-0 flex w-full overflow-hidden font-noto ">
        {["all", "CHARGING", "REWARD", "ITEM"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as typeof filter)}
            className={`w-full px-3 py-2 flex-1 border-b-2 ${
              filter === type
                ? "text-black border-black font-bold"
                : "text-gray-500 border-gray-300"
            }`}
          >
            {type === "all" ? "전체" : getTypeInKorean(type).text}
          </button>
        ))}
      </div>

      {/* Point history list */}
      <div className="flex-grow overflow-y-auto relative w-full box-border scrollbar-hidden">
        <ul className="space-y-4 w-full">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((transaction) => {
              const { text, color } = getTypeInKorean(transaction.type);
              return (
                <li
                  key={transaction.createdAt}
                  className="p-4 border rounded-lg bg-white transition-colors duration-200 hover:bg-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">
                      {transaction.changeCash.toLocaleString()}P
                    </span>
                    <span className={`${color} font-medium text-sm`}>
                      {text}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(transaction.createdAt)}
                  </div>
                </li>
              );
            })
          ) : (
            <div className="text-center text-gray-500 mt-6">
              {filter === "CHARGING" && "충전 내역이 없습니다."}
              {filter === "REWARD" && "보상 내역이 없습니다."}
              {filter === "ITEM" && "구매 내역이 없습니다."}
              {filter === "all" && "포인트 내역이 없습니다."}
            </div>
          )}
        </ul>
        <section className="p-1 flex-shrink-0 h-[62px]"></section>
      </div>
    </div>
  );
}
