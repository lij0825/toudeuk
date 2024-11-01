"use client";

import { Suspense, useState } from "react";
import { fetchPrizes } from "@/apis/prizeApi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PrizeInfo } from "@/types/prize";
import PrizeItem from "./PrizeItem";

export default function PrizeList() {
  // const [size, setSize] = useState<number>(10);
  // const [page, SetPage] = useState<number>(0);
  // const [sort, setSort] = useState<string>("");
  const [size] = useState<number>(10);
  const [page] = useState<number>(0);
  const [sort] = useState<string>("");
  const {
    data: prizes = [],
    isError,
    error,
  } = useQuery<PrizeInfo[]>({
    queryKey: ["prizes"],
    queryFn: () => fetchPrizes({ page, size, sort }),
    staleTime: 5 * 60 * 1000, // 선택적: 5분간 데이터를 fresh로 유지
  });
  if (isError) {
    toast.error(`오류 발생: ${error}`);
  }

  return (
    <>
      <Suspense fallback={""}>
        <section className="overflow-y-auto h-full scrollbar-hidden">
          {prizes?.length === 0 ? (
            <div>
              <div>당첨 목록이 비어있어요 ㅠ</div>
              <div>게임하러가기</div>
            </div>
          ) : (
            prizes?.map((prize: PrizeInfo) => (
              <PrizeItem key={prize.roundId} prizeInfo={prize} />
            ))
          )}
        </section>
      </Suspense>
    </>
  );
}
