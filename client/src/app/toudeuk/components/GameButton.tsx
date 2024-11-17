"use client";

import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";
import { useState } from "react";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  totalClick: number;
}

export default function GameButton({ totalClick }: GameProps) {
  const [size, setSize] = useState(260); // 버튼 및 애니메이션 크기 상태
  const { playClickSound } = useSound();

  const handleClick = () => {
    playClickSound();
    setSize((prevSize) => prevSize + 5); // 크기 확대
    setTimeout(() => {
      setSize(250); // 원래 크기로 복원
    }, 50);
  };

  return (
    <div
      className="relative flex justify-center items-center"
      style={{
        width: `${size - 60}px`,
        height: `${size - 60}px`,
        borderRadius: "50%", // 원형 영역
        overflow: "hidden", // 원 밖으로 초과되는 클릭 영역 제거
        WebkitClipPath: "circle(50%)", // Safari 지원
        clipPath: "circle(50%)", // 클릭 가능한 영역을 원형으로 제한
        cursor: "pointer",
        zIndex: 50,
      }}
      onClick={handleClick} // 클릭 이벤트
    >
      {/* LottieAnimation */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${size}px`, // 부모와 동일한 크기
          height: `${size}px`,
        }}
      >
        <LottieAnimation
          animationData={CUSTOM_ICON.snowframe}
          loop={true}
          autoplay={true}
          width={size} // Lottie 애니메이션 크기
          height={size}
        />
      </div>

      {/* 클릭 수 표시 */}
      {totalClick !== null && (
        <span
          draggable="false"
          className="absolute text-4xl text-[#00ff88] hover:text-[#ff00ff] transition-colors duration-300"
          style={{
            pointerEvents: "none", // 마우스 이벤트 방지
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          {totalClick}
        </span>
      )}
    </div>
  );
}
