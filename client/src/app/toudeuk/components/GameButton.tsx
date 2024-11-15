"use client";

import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";
// 소켓 연결 또는 SSE 방식으로 touch값 fetch
import { useState } from "react";
import { useSound } from '@/hooks/useSound';

interface GameProps {
  totalClick: number;
}

export default function GameButton({ totalClick }: GameProps) {
  // 상태 변수 설정: 크기 상태, 클릭 상태 관리
  const [size, setSize] = useState(250);
  //버튼 클릭음
  const { playClickSound } = useSound();
  // 클릭 시 크기 변경 함수
  const handleClick = () => {
    playClickSound ()
    // 클릭 시 크기 증가
    setSize((prevSize) => prevSize + 5);
    // 클릭 후 일정 시간이 지나면 크기를 원래대로 되돌리기
    setTimeout(() => {
      setSize(250); // 250으로 원래 크기로 복원
    }, 50); // 500ms(0.5초) 후에 크기 복원
  };

  return (
    <>
      {/* 테두리가 회전하는 버튼 */}
      <button
        data-cy="button"
        className="flex flex-col items-center relative"
        onClick={handleClick} // 클릭 시 handleClick 호출
      >
        {/* Lottie 애니메이션, width와 height는 상태를 기반으로 동적으로 변경 */}
        <LottieAnimation
          animationData={CUSTOM_ICON.snowframe}
          loop={true}
          autoplay={true}
          width={size} // size 상태를 width로 설정
          height={size} // size 상태를 height로 설정
        />

        {/* 수신된 count가 있을 때만 표시 */}
        {totalClick !== null && (
          <span
            draggable="false"
            className="absolute typo-title top-1/2 transform -translate-y-1/2 z-10 text-4xl text-[#00ff88] hover:text-[#ff00ff] transition-colors duration-300"
            style={{ pointerEvents: "none" }}
          >
            {totalClick}
          </span>
        )}
      </button>
    </>
  );
}
