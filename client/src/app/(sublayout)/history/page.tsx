"use client";

import { Suspense, useState } from "react";
import HistoryList from "./components/HistoryList";
import PrizeList from "./components/PrizeList";
import ToggleSwitch from "./components/ToggleSwitch";

enum SelectType {
  HISTORY = "history",
  PRIZE = "prize",
}

export default function HistoryPage() {
  const [selected, setSelected] = useState<SelectType>(SelectType.HISTORY);

  const handleToggle = () => {
    setSelected((prevSelected: SelectType) =>
      prevSelected === SelectType.HISTORY
        ? SelectType.PRIZE
        : SelectType.HISTORY
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-noto">
      <section className="flex-shrink-0 p-4 bg-accent-2">
        <p className="text-2xl font-bold">게임 기록</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-lg font-medium text-gray-400">
            {selected === SelectType.HISTORY ? "게임 히스토리" : "당첨 내역"}
          </p>
          <ToggleSwitch
            isToggled={selected === SelectType.PRIZE}
            onToggle={handleToggle}
            label={`${
              selected === SelectType.HISTORY
                ? "당첨 내역 보기"
                : "게임 기록 보기"
            }`}
          />
        </div>
      </section>

      <section className="flex-1 overflow-y-auto">
        {" "}
        {/* 스크롤 컨테이너 설정 */}
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
