"use client";

import { fetchPrizes } from "@/apis/prizeApi";
import { showToast, ToastType } from "@/app/components/Toast";
import { BaseResponse } from "@/types";
import { PrizeInfo, PrizeRequest } from "@/types/prize";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRef, useState } from "react";
import PrizeItem from "./PrizeItem";

export default function PrizeList() {
  const [size] = useState<number>(10);
  const [page] = useState<number>(0);
  const [sort] = useState<string>("");

  // toast가 이미 호출되었는지 여부를 추적
  const hasShownToast = useRef(false);

  const { data } = useSuspenseQuery<Partial<BaseResponse<PrizeInfo[]>>>({
    queryKey: ["prizes"],
    queryFn: () => fetchPrizes({ page, size, sort } as PrizeRequest),
    staleTime: 5 * 60 * 1000,
  });

  // 에러가 발생하면 한 번만 toast를 호출
  if (!data.success && !hasShownToast.current) {
    showToast(ToastType.ERROR, data.message || "에러가 발생했습니다.");
    hasShownToast.current = true; // toast가 한 번만 호출되도록 설정
  }

  const prizes = data?.data || [];

  return (
    <section className="overflow-y-auto h-full scrollbar-hidden">
      {prizes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-black font-noto h-full">
          <div className="mb-4 text-lg">당첨 내역이 없습니다.</div>
          <Link
            href="/toudeuk"
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-colors duration-200"
          >
            게임하러 가기
          </Link>
        </div>
      ) : (
        prizes.map((prize: PrizeInfo) => (
          <PrizeItem key={prize.roundId} prizeInfo={prize} />
        ))
      )}
    </section>
  );
}
