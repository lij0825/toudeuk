"use client";

import { Suspense, useState, useRef } from "react";
import HistoryList from "./components/HistoryList";
import PrizeList from "./components/PrizeList";
import ToggleSwitch from "./components/ToggleSwitch";

enum SelectType {
  HISTORY = "history",
  PRIZE = "prize",
}

export default function HistoryPage() {
  const [selected, setSelected] = useState<SelectType>(SelectType.HISTORY);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentTranslateX = useRef(0);
  const currentTranslateY = useRef(0);

  // 탭 전환 함수
  const handleToggle = () => {
    setSelected((prevSelected) =>
      prevSelected === SelectType.HISTORY
        ? SelectType.PRIZE
        : SelectType.HISTORY
    );
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    startY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    if (scrollRef.current) scrollRef.current.style.transition = "none"; // 트랜지션 일시 제거
  };

  // 드래그 이동
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;

    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;

    // x축으로 일정 거리 이상 움직였을 경우에만 탭 전환 인식
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      currentTranslateX.current = deltaX;
      if (scrollRef.current)
        scrollRef.current.style.transform = `translateX(${deltaX}px)`;
    }
    // y축으로 움직였을 경우 스크롤로 인식
    else if (Math.abs(deltaY) > Math.abs(deltaX)) {
      currentTranslateY.current = deltaY;
      if (scrollRef.current) scrollRef.current.scrollTop -= deltaY; // y축 스크롤
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const threshold = 100; // x축 전환을 위한 기준 거리

    if (scrollRef.current)
      scrollRef.current.style.transition = "transform 0.3s ease"; // 트랜지션 복구

    if (
      currentTranslateX.current > threshold &&
      selected === SelectType.PRIZE
    ) {
      setSelected(SelectType.HISTORY);
    } else if (
      currentTranslateX.current < -threshold &&
      selected === SelectType.HISTORY
    ) {
      setSelected(SelectType.PRIZE);
    }

    resetPosition();
  };

  // 초기 위치로 리셋
  const resetPosition = () => {
    if (scrollRef.current) scrollRef.current.style.transform = "translateX(0)";
    currentTranslateX.current = 0;
    currentTranslateY.current = 0;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-noto">
      {/* 제목 섹션 */}
      <section className="flex-shrink-0 flex items-end w-full mb-2">
        <div className="flex flex-col mr-2">
          <p className="text-2xl font-bold typo-title leading-tight">Game</p>
          <p className="text-2xl font-bold typo-title leading-tight">History</p>
        </div>
      </section>

      {/* 탭 네비게이션 */}
      <section className="flex-shrink-0 flex items-center justify-center w-full mb-4">
        <ToggleSwitch
          isToggled={selected === SelectType.PRIZE}
          onToggle={handleToggle}
          labelLeft="게임 기록"
          labelRight="당첨 내역"
        />
      </section>

      {/* 탭 내용 */}
      <section
        className="relative flex-1 overflow-y-auto scrollbar-hidden"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{ userSelect: "none", transition: "transform 0.3s ease" }}
      >
        {selected === SelectType.HISTORY ? (
          <Suspense fallback={<div className="p-4">로딩 중...</div>}>
            <HistoryList />
          </Suspense>
        ) : (
          <Suspense fallback={<div className="p-4">로딩 중...</div>}>
            <PrizeList />
          </Suspense>
        )}
      </section>
      <section className="p-1 flex-shrink-0 h-[60px]"></section>
    </div>
  );
}
