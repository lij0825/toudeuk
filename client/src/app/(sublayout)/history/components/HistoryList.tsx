"use client";

import { fetchHistories } from "@/apis/historyApi";
import { ContentInfo, HistoriesInfo } from "@/types";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import HistoryItem from "./HistoryItem";

export enum SortType {
  DEFAULT = "",
  GAME_ASC = "round,ASC",
  GAME_DESC = "round,DESC",
}

const querykey = "histories";
const size = 10;

export default function HistoryList() {
  const [page] = useState(0);
  const [sort] = useState<SortType>(SortType.DEFAULT);

  const {
    data: histories,
    isError,
    error,
  } = useQuery<HistoriesInfo>({
    queryKey: [querykey, page, sort],
    queryFn: () => fetchHistories({ page, size, sort }),
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    toast.error(`에러가 발생했습니다: ${(error as Error).message}`);
  }

  const contents = histories?.content;

  return (
    <div className="p-4">
      {contents?.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>비어있어요 ㅠ</p>
          <button className="mt-2 text-blue-500 hover:underline">
            게임하러가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 ">
          {contents?.map((content: ContentInfo, index: number) => (
            <HistoryItem key={index} content={content} />
          ))}
        </div>
      )}
    </div>
  );
}
