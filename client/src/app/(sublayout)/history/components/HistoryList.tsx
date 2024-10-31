"use client";

import { Suspense } from "react";
// import { fetchHistories } from "@/apis/historyApi";
// import { useQuery } from "@tanstack/react-query";
// import { HistoriesInfo } from "@/types";
// import HistoryItem from "./HistoryItem";
// import Histories from "./DummyHistory.json";
// import { ContentInfo } from "@/types";

export default function HistoryList() {
  //   const [histories, setHistories] = useState<ContentInfo[]>([]);
  //   const [page, SetPage] = useState(0); //페이지위치
  //   const size = 10; //한페이지에 몇개 우선 10개
  //   const [sort, setSort] = useState("asc");

  //   const { data: histories, isError } = useQuery<HistoriesInfo>({
  //     queryKey: ["histories", page, sort],
  //     queryFn: fetchHistories({ page, size, sort }),
  //     staleTime: 10 * 60 * 1000, // 선택적: 10분간 데이터를 fresh로 유지
  //   });
  //   if (isError) {
  //     toast.error(`오류 발생: ${error}`);
  //   }

  //   const fetchHistories = (pageNumber: number) => {
  //     const startIdx = pageNumber * Histories.data.size;
  //     const endIdx = startIdx + Histories.data.size;
  //   };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>{}</Suspense>
    </>
  );
}
