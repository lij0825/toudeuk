"use client";

import { useState } from "react";
import HistoryList from "./components/HistoryList";
import PrizeList from "./components/PrizeList";
import ToggleSwitch from "./components/ToggleSwitch";

enum SelectType {
  HISTORY = "history",
  PRIZE = "prize",
}

export default function HistoryPage() {
  const [selected, setSelected] = useState<SelectType>(SelectType.PRIZE);

  const handleToggle = () => {
    setSelected((prevSelected) =>
      prevSelected === SelectType.HISTORY
        ? SelectType.PRIZE
        : SelectType.HISTORY
    );
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden font-noto">
      <section className="flex-shrink-0 items-end mb-4 common-link-none bg-accent-2">
        <p className="text-2xl font-bold">게임 기록</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-lg font-medium text-gray-400 ">
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

      <div className="bg-sub-background p-[1px] m-2 flex-shrink-0"></div>

      <section className="flex-grow relative h-full overflow-y-auto scrollbar-hidden">
        {selected === SelectType.HISTORY ? (
          <div className="history-card p-4 rounded-lg shadow-lg ">
            <HistoryList />
          </div>
        ) : (
          <div className="prize-card p-4 rounded-lg shadow-lg ">
            <PrizeList />
          </div>
        )}
      </section>
    </div>
  );
}
