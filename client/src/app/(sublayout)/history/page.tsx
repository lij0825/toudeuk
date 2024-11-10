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

  // 드래그 스크롤 관련 변수
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const handleToggle = () => {
    setSelected((prevSelected: SelectType) =>
      prevSelected === SelectType.HISTORY
        ? SelectType.PRIZE
        : SelectType.HISTORY
    );
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.pageY - (scrollRef.current?.offsetTop || 0);
    scrollTop.current = scrollRef.current?.scrollTop || 0;
  };

  // 드래그 이동
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const y = e.pageY - (scrollRef.current.offsetTop || 0);
    const walk = (y - startY.current) * 1.5; // 드래그 속도 조절
    scrollRef.current.scrollTop = scrollTop.current - walk;
  };

  // 드래그 종료
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-noto">
      <section className="flex-shrink-0 flex items-end w-full mb-2">
        <div className="flex flex-col mr-2">
          <p className="text-2xl font-bold typo-title leading-tight">Game</p>
          <p className="text-2xl font-bold typo-title leading-tight">History</p>
        </div>

        <div className="mb-1">
          <ToggleSwitch
            isToggled={selected === SelectType.PRIZE}
            onToggle={handleToggle}
            label={`${
              selected === SelectType.HISTORY ? "당첨 내역" : "게임 기록"
            }`}
          />
        </div>
      </section>

      <section
        className="flex-1 overflow-y-auto scrollbar-hidden"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        style={{ userSelect: "none" }} // 드래그 중 텍스트 선택 방지
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
    </div>
  );
}
