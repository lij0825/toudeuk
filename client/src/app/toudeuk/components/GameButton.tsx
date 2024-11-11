"use client";

//소켓 연결 또는 SSE 방식으로 touch값 fetch
import { useState } from "react";
interface GameProps {
  totalClick: number;
}

export default function GameButton({ totalClick }: GameProps) {

  return (
    <>
      {/* 테두리가 회전하는 버튼 */}
      <div
        data-cy="button"
        className="absolute w-40 h-40 rounded-full border-2 border-[#00ff88] hover:border-[#ff00ff] transition-colors duration-300 animate-spin-border"
      ></div>
      {/* 수신된 count가 있을 때만 표시 */}
      {totalClick !== null && (
        <span
          className="z-10 typo-title text-3xl text-[#00ff88] hover:text-[#ff00ff] transition-colors duration-300 "
          style={{ pointerEvents: "none" }}
        >
          {totalClick}
        </span>
      )}
      <style jsx>{`
        @keyframes spinBorder {
          0% {
            transform: rotate(0deg);
            border-color: #00ff88;
          }
          50% {
            border-color: #ff00ff;
          }
          100% {
            transform: rotate(360deg);
            border-color: #00ff88;
          }
        }

        .animate-spin-border {
          animation: spinBorder 2s linear infinite;
        }
      `}</style>
    </>
  );
}
