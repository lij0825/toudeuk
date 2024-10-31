"use client";

import { fetchHistories } from "@/apis/historyApi";
import { HistoriesInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";

export default function HistoryList() {
  // const [histories, setHistories] = useState<ContentInfo[]>([]);
  // const [page, SetPage] = useState(0); //페이지위치
  const [page] = useState(0); //페이지위치
  const size = 10; //한페이지에 몇개 우선 10개
  // const [sort, setSort] = useState("asc");
  const [sort] = useState("asc");

  const { data: history, isError } = useQuery<HistoriesInfo>({
    queryKey: ["history", page, sort],
    queryFn: () => fetchHistories({ page, size, sort }),
    staleTime: 10 * 60 * 1000, // 선택적: 10분간 데이터를 fresh로 유지
  });
  if (isError) {
    toast.error(`오류 발생`);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {history?.content.map((item, index) => (
          <div key={index}>
            <p>{item.clickGameId}</p>
            <p>{item.round}</p>
            {/* 필요한 필드 추가 */}
          </div>
        ))}
      </div>
    </Suspense>
  );
}
