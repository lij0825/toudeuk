"use client";

import { useState } from "react";
import HistoryList from "./components/HistoryList";
import PrizeList from "./components/PrizeList";
import ToggleSwitch from "./components/ToggleSwitch"; // ToggleSwitch 컴포넌트 가져오기

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
    <div className="h-full scrollbar-hidden relative overflow-hidden">
      <section className="flex-shrink-0 items-end typo-title mb-2">
        <p>Game</p>
        <div className="flex justify-between items-end">
          <p>History</p>
          <ToggleSwitch
            isToggled={selected === SelectType.PRIZE}
            onToggle={handleToggle}
            label={`${
              selected === SelectType.HISTORY
                ? "당첨내역 보기"
                : "게임 기록 보기"
            }`}
          />
        </div>
      </section>

      <section className="flex-grow overflow-y-hidden relative">
        {selected === SelectType.HISTORY ? (
          <div className="history-card">
            <HistoryList />
          </div>
        ) : (
          <div className="prize-card">
            <PrizeList />
          </div>
        )}
      </section>

      <style jsx>{`
        .history-card {
          background: linear-gradient(180deg, #252a30 17.2%, #16171b 117.2%);
        }
        .prize-card {
          background: linear-gradient(180deg, #1b2229 17.2%, #0f1012 117.2%);
          border-color: #ffffff;
        }
      `}</style>
    </div>
  );
}
