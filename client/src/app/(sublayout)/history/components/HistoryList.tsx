"use client";

import { fetchHistories } from "@/apis/historyApi";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";
import { ContentInfo } from "@/types";
import HistoryItem from "./HistoryItem";

enum SortType {
  DEFAULT = "",
  GAME_ASC = "round,ASC",
  GAME_DESC = "round,DESC",
}

export default function HistoryList() {
  // const [page, setPage] = useState(0); // 페이지 위치
  const [page] = useState(0); // 페이지 위치
  const size = 10; // 한 페이지에 몇 개, 우선 10개
  // const [sort, setSort] = useState<SortType>(SortType.DEFAULT);
  const [sort] = useState<SortType>(SortType.DEFAULT);

  const {
    data: history,
    isError,
  } = useQuery<ContentInfo[]>({
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
        {history?.length === 0 ? (
          <div>
            <div>비어있어요 ㅠ</div>
            <div>게임하러가기</div>
          </div>
        ) : (
          history?.map((content, index) => (
            <HistoryItem key={index} content={content} />
          ))
        )}
      </div>
    </Suspense>
  );
}
