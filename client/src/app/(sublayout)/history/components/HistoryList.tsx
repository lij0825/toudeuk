"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { fetchHistories } from "@/apis/history/historyApi";
import { ContentInfo, HistoriesInfo, Page } from "@/types";
import { toast } from "react-toastify";
import HistoryItem from "./HistoryItem";
import { useRouter } from "next/navigation";

export enum SortType {
  DEFAULT = "",
  GAME_ASC = "round,ASC",
  GAME_DESC = "round,DESC",
}

export default function HistoryList() {
  const router = useRouter();

  // 무한 스크롤 데이터 fetching
  const size = 7;
  const queryKey = "histories";

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
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
    const targetElement = observerRef.current;

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

    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      if (targetElement) observer.unobserve(targetElement);
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="p-4">
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
            const id = content.clickGameId.toString();
            return (
              <div
                key={content.clickGameId}
                ref={isLastItem ? observerRef : null}
                onClick={() => {
                  router.push(`/history/${id}`);
                }}
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
    </div>
  );
}
