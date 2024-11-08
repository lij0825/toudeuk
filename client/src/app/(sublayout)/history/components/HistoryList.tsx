"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { fetchHistories } from "@/apis/history/historyApi";
import { ContentInfo, HistoriesInfo, Page } from "@/types";
import { toast } from "react-toastify";
import HistoryItem from "./HistoryItem";

export enum SortType {
  DEFAULT = "",
  GAME_ASC = "round,ASC",
  GAME_DESC = "round,DESC",
}

export default function HistoryList() {
  // 좌표값 출력 함수
  const browserPoint = (event: MouseEvent) => {
    console.log(`브라우저 좌표 : (${event.pageX}, ${event.pageY})`);
  };
  const clientPoint = (event: MouseEvent) => {
    console.log(`화면 좌표 : (${event.clientX}, ${event.clientY})`);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      browserPoint(e);
      clientPoint(e);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // 무한 스크롤 데이터 fetching
  const size = 7;
  const queryKey = "histories";

  const {
    data,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) =>
      fetchHistories({
        page: pageParam as number,
        size,
        sort: SortType.DEFAULT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: HistoriesInfo) => {
      const currentPage = lastPage.page.number;
      const totalPages = lastPage.page.totalPages;

      // 0-based 인덱스일 경우, totalPages - 1과 비교
      return currentPage < totalPages - 1 ? currentPage + 1 : undefined;
    },
  });

  if (isFetchingNextPage) {
    console.log("Loading...");
  } else if (data) {
    console.log("Data Loaded:", data);
  }

  if (isError) {
    toast.error(`에러가 발생했습니다: ${(error as Error).message}`);
  }

  const contents = data?.pages.flatMap((page) => page.content) || [];
  // !옵저버 분리하기..
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
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
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="h-full overflow-y-auto p-4 scrollbar-hidden">
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
      {isFetchingNextPage && (
        <div className="text-center text-gray-500">로딩 중...</div>
      )}
      {hasPreviousPage && (
        <button
          onClick={() => fetchPreviousPage()}
          className="mt-4 w-full text-center text-blue-500 hover:underline"
        >
          이전 페이지 로드
        </button>
      )}
    </div>
  );
}
