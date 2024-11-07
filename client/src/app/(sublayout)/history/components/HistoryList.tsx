"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { fetchHistories } from "@/apis/historyApi";
import { ContentInfo, HistoriesInfo, Page } from "@/types";
import { toast } from "react-toastify";
import HistoryItem from "./HistoryItem";

export enum SortType {
  DEFAULT = "",
  GAME_ASC = "round,ASC",
  GAME_DESC = "round,DESC",
}

export default function HistoryList() {
  const size = 7;
  const queryKey = "histories";

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam }: QueryFunctionContext) =>
      fetchHistories({
        page: pageParam as number,
        size,
        sort: SortType.DEFAULT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  if (isError) {
    toast.error(`에러가 발생했습니다: ${(error as Error).message}`);
  }

  const contents = data?.pages.flatMap((page) => page.content) || [];
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="h-full overflow-y-auto p-4">
      {contents.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>비어있어요 ㅠ</p>
          <button className="mt-2 text-blue-500 hover:underline">
            게임하러가기
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {contents.map((content: ContentInfo, index: number) => {
            const isLastItem = index === contents.length - 1;
            return (
              <div
                key={content.clickGameId}
                ref={isLastItem ? observerRef : null}
              >
                <HistoryItem content={content} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
