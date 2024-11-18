"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useGetRecentHistories from "@/apis/history/useRecentHistory";

export default function RecentHistoriesCarousel() {
  const router = useRouter();

  const {
    data: recentHistories,
    isError,
    error,
    isLoading,
  } = useGetRecentHistories();

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const filteredHistories = recentHistories?.content.slice(1) || [];

  // 자동 넘기기
  useEffect(() => {
    if (filteredHistories.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === filteredHistories.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [filteredHistories?.length]);

  if (isLoading) {
    return (
      <div
        className="carousel-card w-full font-noto bg-blue-300 rounded-lg flex flex-col items-center justify-center p-2"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-gray-500 mb-1">최신 게임 정보 불러오는 중...</div>
        <Link
          href="/toudeuk"
          className="px-2 text-sm py-1 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 hover:animate-shake"
        >
          게임하러 가기
        </Link>
      </div>
    );
  }
  if (!filteredHistories || filteredHistories.length === 0) {
    return (
      <div
        className="carousel-card w-full font-noto bg-blue-300 rounded-lg flex flex-col items-center justify-center p-2"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-gray-500 mb-1">최근 진행된 게임이 없어요</div>
        <Link
          href="/toudeuk"
          className="px-2 text-sm py-1 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 hover:animate-shake"
        >
          게임하러 가기
        </Link>
        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            20%,
            60% {
              transform: translateX(-2px);
            }
            40%,
            80% {
              transform: translateX(2px);
            }
          }

          .hover\:animate-shake:hover {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const distance = e.pageX - startX.current;
    if (distance > 50) {
      prevItem();
      isDragging.current = false;
    } else if (distance < -50) {
      nextItem();
      isDragging.current = false;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const nextItem = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredHistories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevItem = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredHistories.length - 1 : prevIndex - 1
    );
  };

  const currentGame = filteredHistories[currentIndex];

  if (!currentGame) return null;

  return (
    <div
      className="flex flex-col items-center justify-center overflow-hidden font-noto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={containerRef}
      style={{ perspective: "1000px" }}
    >
      <div
        key={currentIndex} // currentIndex가 변경될 때마다 컴포넌트 재렌더링
        className="carousel-card w-full bg-[#d3ffdee5] rounded-lg flex flex-col items-center justify-center p-2 transition-transform duration-500 transform"
        style={{
          animation: "flipUp 1s ease-in-out",
        }}
        onClick={() => {
          router.push(`/history/${currentGame.clickGameId}`);
        }}
      >
        <section className="flex items-center font-semibold space-x-2">
          <div className="text-md">{currentGame.clickGameId}회차</div>
          <div className="text-sm">
            {new Date(currentGame.createdAt).toLocaleDateString()}
          </div>
        </section>
        <div className="text-sm">
          ✨ 우승자: {currentGame.winner?.nickname || "정보 없음"}
        </div>
        <div className="text-sm">
          🔥 최다 클릭자: {currentGame.maxClicker?.nickname || "정보 없음"}
        </div>
      </div>
    </div>
  );
}
