"use client";
import CurrentRank from "./components/CurrentRank";
import GameButton from "./components/GameButton";

export default function Toudeuk() {
  return (
    <div className="flex flex-col items-center h-full">
      <CurrentRank rank={7} />
      <GameButton />
    </div>
  );
}
