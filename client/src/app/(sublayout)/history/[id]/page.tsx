import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchHistoryDetailInfo } from "@/apis/history/historyApi";
import { HistoryDetailInfo, DetailContentInfo } from "@/types";
import HistoryItem from "../components/HistoryItem";

const size = 7;
const queryKey = "historyDetail";

export default function HistoryDetail({ params }: { params: { id: string } }) {
  // 무한 스크롤 데이터 fetching
  const id = parseInt(params.id);

  const {
    data,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: [queryKey, id],
    queryFn: ({ pageParam }) =>
      fetchHistoryDetailInfo(id, {
        page: pageParam as number,
        size,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: HistoryDetailInfo) => {
      const currentPage = lastPage.page.number;
      const totalPages = lastPage.page.totalPages;
      return currentPage < totalPages - 1 ? currentPage + 1 : undefined;
    },
  });

  if (isError) {
    console.error("에러");
  }

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

  const contents = data?.pages.flatMap((page) => page.content) || [];

  return (
    <>
      {contents.map((content: DetailContentInfo, index: number) => {
        <HistoryItem key={index} content={content} />;
      })}
    </>
  );
}
