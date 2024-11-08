"use client";

import { HistoriesInfo } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { fetchHistories } from "@/apis/history/historyApi";
import Link from "next/link";

export default function PrizeList() {
  const size = 10;
  const queryKey = "prizes";

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) =>
      fetchHistories({
        page: pageParam as number,
        size,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: HistoriesInfo) => {
      const currentPage = lastPage.page.number;
      const totalPages = lastPage.page.totalPages;

      // 0-based 인덱스일 경우, totalPages - 1과 비교
      return currentPage < totalPages - 1 ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  // const contents =

  // const contents = data?.pages.flatMap((page) => {

  // }) || [];

  const { targetRef } = useInfiniteScroll({ fetchNextPage, hasNextPage });

  return <section ref={targetRef}></section>;
  //     <section className="overflow-y-auto h-full scrollbar-hidden">

  //       {contents.length === 0 ? (
  //         <div className="flex flex-col items-center justify-center text-black font-noto h-full">
  //           <div className="mb-4 text-lg">당첨 내역이 없습니다.</div>
  //           <Link
  //             href="/toudeuk"
  //             className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-colors duration-200"
  //           >
  //             게임하러 가기
  //           </Link>
  //         </div>
  //       ) : (

  // <div ref = {targetRef}>
  //         {

  // contents.map((content: any) => {
  //   return (
  //     <div key={content.roundId} >

  //   </div>
  //   )

  // }
}
