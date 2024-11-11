"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useGetRecentHistories from "@/apis/history/useRecentHistory";
import { useRouter } from "next/navigation";

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

  // 자동 넘기기
  useEffect(() => {
    if (recentHistories?.content) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === recentHistories.content.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [recentHistories?.content?.length, recentHistories?.content]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!recentHistories?.content || recentHistories.content.length === 0) {
    return <div className="text-gray-500">No recent games found.</div>;
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
      prevIndex === recentHistories!.content.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevItem = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recentHistories!.content.length - 1 : prevIndex - 1
    );
  };

  const currentGame = recentHistories!.content[currentIndex];

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
