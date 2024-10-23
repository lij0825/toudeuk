"use client";

//소켓 연결 또는 SSE 방식으로 touch값 fetch
import { useState } from "react";

export default function Button() {
  const [isCount, setIsCount] = useState<number>(0);

  const handleClick = () => {
    setIsCount(isCount+1);
  };
  return (
    <>
      <button
      data-cy = "button"
      onClick={handleClick}
      className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#00ff88] hover:border-[#ff00ff] text-[#00ff88] hover:text-[#ff00ff] transition-colors duration-300"
    >
      {isCount}
    </button>
    </>
  );
}
