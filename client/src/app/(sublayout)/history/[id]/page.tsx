"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchHistoryDetailInfo } from "@/apis/history/historyDetail";
import { fetchGameRewardHistory } from "@/apis/history/rewardhistory";
import {
  HistoryDetailInfo,
  DetailContentInfo,
  MaxClickerInfo,
  WinnerInfo,
} from "@/types";
import {
  HistoryDetailItem,
  MiddleRewardInfo,
  MaxClickerInfoCard,
  WinnerInfoCard,
  NoInfoCard,
} from "./components";
import dynamic from "next/dynamic";
import { CUSTOM_ICON } from "@/constants/customIcons";

const size = 10;
const queryKey = "historyDetail";

const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  { ssr: false }
);

export default function HistoryDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  // 유저 보상 내역들
  const { data: reward } = useQuery({
    queryKey: [queryKey, "reward"],
    queryFn: () => fetchGameRewardHistory(id),
  });

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startY.current = event.clientY;
    scrollTop.current = scrollContainerRef.current?.scrollTop || 0;
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current && scrollContainerRef.current) {
      const dy = event.clientY - startY.current;
      scrollContainerRef.current.scrollTop = scrollTop.current - dy;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = "auto";
  };

  // 전체 클릭 내용 구현
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery({
      queryKey: [queryKey, id],
      queryFn: ({ pageParam }) =>
        fetchHistoryDetailInfo(id, {
          page: pageParam as number,
          size,
          sort: "Id,desc",
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage: HistoryDetailInfo) => {
        const currentPage = lastPage.page.number;
        const totalPages = lastPage.page.totalPages;
        return currentPage < totalPages - 1 ? currentPage + 1 : undefined;
      },
    });

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

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) observer.unobserve(currentObserver);
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const contents = data?.pages.flatMap((page) => page.content) || [];

  if (isError) {
    console.error("에러");
  }

  // 렌더링 영역
  return (
    <div className="flex flex-col h-full">
      <div className="border-b flex-shrink-0">
        <section className="mb-2">
          <h1 className="typo-title">Reward</h1>
          <h1 className="typo-title">Details</h1>
        </section>

        {/* 우승자 */}
        <section className="flex justify-between items-start space-x-4 font-noto">
          <div className="w-1/2">
            {reward?.winner ? (
              <WinnerInfoCard user={reward.winner as WinnerInfo} />
            ) : (
              <NoInfoCard icon="🏆" title="우승자" message="정보가 없습니다" />
            )}
          </div>

          {/* 최다 클릭자 */}
          <div className="w-1/2">
            {reward?.maxClicker ? (
              <MaxClickerInfoCard user={reward.maxClicker as MaxClickerInfo} />
            ) : (
              <NoInfoCard
                icon="👆"
                title="최다 클릭자"
                message="정보가 없습니다"
              />
            )}
          </div>
        </section>

        {/* 중간 보상 */}
        <div className="overflow-x-auto flex py-2 scrollbar-hidden w-full">
          {Array.isArray(reward?.middleRewardUsers) &&
          reward.middleRewardUsers.length > 0 ? (
            <MiddleRewardInfo users={reward.middleRewardUsers} />
          ) : (
            <div className="flex justify-center items-center w-full">
              <NoInfoCard
                icon="🎖️"
                title="중간 보상자"
                message="정보가 없습니다"
                className="w-full max-w-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* 스크롤 영역 */}
      <h2 className="typo-body my-2 font-extrabold">Click Log</h2>
      <div
        className="flex-1 overflow-y-auto scrollbar-hidden"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {contents.map((content: DetailContentInfo, index: number) => (
          <HistoryDetailItem key={index} content={content} />
        ))}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center">
            <LottieAnimation
              animationData={CUSTOM_ICON.mainLoading}
              loop={1}
              width={100}
              height={45}
              cursor="none"
            />
          </div>
        )}
        <div ref={observerRef} style={{ height: "1px" }} />
      </div>
    </div>
  );
}
