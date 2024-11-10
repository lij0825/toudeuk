"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchHistoryDetailInfo } from "@/apis/history/historyDetail";
import { fetchGameRewardHistory } from "@/apis/history/rewardhistory";
import { HistoryDetailInfo, DetailContentInfo, MaxClickerInfo, WinnerInfo, GameUserInfo } from "@/types";
import { toast } from "react-toastify";
import HistoryDetailItem from "./components/HistoryDetailInfo";
import MiddleRewardInfo from "./components/MiddleRewardInfo";
import MaxClickerInfoCard from "./components/MaxClickerInfo";
import WinnerInfoCard from "./components/Winnnerinfo";

const size = 7;
const queryKey = "historyDetail";

export default function HistoryDetail({ params }: { params: { id: string } }) {
  const [isMiddleRewardVisible, setIsMiddleRewardVisible] = useState(false);

  const toggleMiddleReward = () => {
    setIsMiddleRewardVisible((prev) => !prev);
  };
  const id = parseInt(params.id);

  //유저 보상 내역들
  const { data: reward } = useQuery({
    queryKey: [queryKey, "reward"],
    queryFn: () => fetchGameRewardHistory(id),
  });

  //전체 클릭 내용 구현
  const {
    data,
    fetchNextPage,
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

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!reward) {
      toast("보상정보가 없습니다.");
    }
  }, [reward]);

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
        threshold: 0.1 // 요소가 완전히 화면에 들어올 때 트리거
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

  if (!reward) {
    return <div>보상내역 없음</div>;
  }

  if (isError) {
    console.error("에러");
  }



  return (
    <div className="flex flex-col h-full">
      <div className="p-4 mb-6 border-b flex-shrink-0">
        <h2 className="text-2xl font-bold mb-2">Reward Details</h2>
        {/* 우승자 */}
        <div>
          <h3 className="text-xl font-semibold mt-4 mb-1">Winner</h3>
          {reward.winner ? (
            <WinnerInfoCard user={reward.winner as WinnerInfo} />
          ) : (
            <p>정보가 없습니다</p>
          )}
        </div>
        {/* 최다 클릭자 */}
        <div>
          <h3 className="text-xl font-semibold mb-1">Max Clicker</h3>
          {reward.maxClicker ? (
            <MaxClickerInfoCard user={reward.maxClicker as MaxClickerInfo} />
          ) : (
            <p>정보가 없습니다</p>
          )}
        </div>
        {/* 중간보상 */}
        {/* 중간보상 */}
        <div>
          <button
            onClick={toggleMiddleReward}
            className="text-xl font-semibold mt-4 mb-1 text-blue-500"
          >
            Middle Reward Users {isMiddleRewardVisible ? "▲" : "▼"}
          </button>
          {isMiddleRewardVisible && (
            <div>
              {Array.isArray(reward.middleRewardUsers) && reward.middleRewardUsers.length > 0 ? (
                reward.middleRewardUsers.map((user: GameUserInfo) => (
                  <MiddleRewardInfo key={user.nickname} user={user} />
                ))
              ) : (
                <p>정보가 없습니다</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 스크롤 영역을 지정 */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {contents.map((content: DetailContentInfo, index: number) => (
          <HistoryDetailItem key={index} content={content} />
        ))}
        <div ref={observerRef} style={{ height: "1px" }} />
      </div>
    </div>
  );
}