"use client";

import { Suspense } from "react";
// import { fetchPrizes } from "@/apis/prizeApi";
// import { useQuery } from "@tanstack/react-query";
import { PrizeInfo } from "@/types/prize";
import Loading from "../loading";

const prizeInfoDummyData: PrizeInfo[] = Array.from(
  { length: 100 },
  (_, index) => ({
    roundId: index + 1,
    date: `2024-10-${(index % 31) + 1}`,
    point: Math.floor(Math.random() * 200000) + 50000,
    nickName: `Player${String.fromCharCode(65 + (index % 26))}`,
    participant: Math.floor(Math.random() * 500) + 50,
    clicks: Math.floor(Math.random() * 50) + 10,
    imageSrc: `https://picsum.photos/seed/picsum${index}/150/150`,
  })
);

export default function PrizeList() {
  // const {
  //   data: prizes,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery<PrizeInfo[]>({
  //   queryKey: ["prizes"],
  //   queryFn: fetchPrizes,
  //   staleTime: 5 * 60 * 1000, // 선택적: 5분간 데이터를 fresh로 유지
  // });

  return (
    <div className="h-full">
      <Suspense fallback={<Loading />}>
        <section className="overflow-y-auto h-full">
          {/* 고정된 높이 및 스크롤 처리 */}
          {prizeInfoDummyData
            .slice()
            .reverse()
            .map((data) => (
              <div className="card h-10" key={data.roundId}>
                {data.roundId}
              </div>
            ))}
        </section>
      </Suspense>
    </div>
  );
}
