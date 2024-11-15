"use client";

import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";
import { useState } from "react";
import { useSound } from "@/hooks/useSound";

interface GameProps {
  totalClick: number;
}

export default function GameButton({ totalClick }: GameProps) {
  const [size, setSize] = useState(250);
  const { playClickSound } = useSound();

  const handleClick = () => {
    playClickSound();
    setSize((prevSize) => prevSize + 5);
    setTimeout(() => {
      setSize(250);
    }, 50);
  };

  return (
    <>
      <div
        className="relative w-[250px] h-[250px] rounded-full border-black"
        onClick={handleClick}
      >
        <button
          data-cy="button"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieAnimation
            animationData={CUSTOM_ICON.snowframe}
            loop={true}
            autoplay={true}
            width={size}
            height={size}
          />
        </button>

        {totalClick !== null && (
          <span
            draggable="false"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-4xl text-[#00ff88] hover:text-[#ff00ff] transition-colors duration-300"
            style={{ pointerEvents: "none" }}
          >
            {totalClick}
          </span>
        )}
      </div>

      <style jsx>{`
        button {
          /* Safari에서 clip-path가 작동하지 않을 경우를 위한 대체 속성 */
          -webkit-clip-path: circle(100%);
        }
      `}</style>
    </>
  );
}
