"use client";

import { Suspense } from "react";
// import { fetchPrizes } from "@/apis/prizeApi";
// import { useQuery } from "@tanstack/react-query";
import { PrizeInfo } from "@/types/prize";
import Card from "./Card";
import Loading from "../loading";

const prizeInfoDummyData: PrizeInfo[] = [
  {
    roundId: 1,
    date: "2024-10-10",
    point: 50000,
    nickName: "WinnerA",
    participant: 100,
    clicks: 25,
    imageSrc: "https://picsum.photos/seed/picsum1/150/150",
  },
  {
    roundId: 2,
    date: "2024-10-17",
    point: 100000,
    nickName: "ChampionB",
    participant: 200,
    clicks: 30,
    imageSrc: "https://picsum.photos/seed/picsum2/150/150",
  },
  {
    roundId: 3,
    date: "2024-10-24",
    point: 75000,
    nickName: "LuckyC",
    participant: 150,
    clicks: 22,
    imageSrc: "https://picsum.photos/seed/picsum3/150/150",
  },
  {
    roundId: 4,
    date: "2024-10-31",
    point: 125000,
    nickName: "TopPlayerD",
    participant: 250,
    clicks: 28,
    imageSrc: "https://picsum.photos/seed/picsum4/150/150",
  },
  {
    roundId: 5,
    date: "2024-11-07",
    point: 200000,
    nickName: "MasterE",
    participant: 300,
    clicks: 35,
    imageSrc: "https://picsum.photos/seed/picsum5/150/150",
  },
];

export default function Prize() {
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
    <>
      <section className="fixed top-0 bg-color-black">
        <h1 className="text-3xl z-50">당첨내역</h1>
      </section>
      <Suspense fallback={<Loading />}>
        <section className="overflow-auto">
          {prizeInfoDummyData
            .slice()
            .reverse()
            .map((data) => (
              <Card key={data.roundId} prizeInfo={data} />
            ))}
        </section>
      </Suspense>
    </>
  );
}
