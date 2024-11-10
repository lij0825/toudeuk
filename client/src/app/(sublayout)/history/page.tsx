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
    <div className="flex flex-col h-full overflow-hidden font-noto">
      <section className="flex-shrink-0 flex items-end w-full mb-2">
        <div className="flex flex-col mr-2">
          <p className="text-2xl font-bold typo-title leading-tight">Game</p>
          <p className="text-2xl font-bold typo-title leading-tight">History</p>
        </div>
        <div className="text-lg text-gray-400">
          {selected === SelectType.HISTORY ? "전체 게임 기록" : "내 당첨 내역"}
        </div>
        <div className="ml-auto">
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

      <section className="flex-1 overflow-y-auto scrollbar-hidden">
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
