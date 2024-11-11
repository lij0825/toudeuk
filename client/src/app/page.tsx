"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Login from "./components/Login";
import { CUSTOM_ICON } from "@/constants/customIcons";

const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  { ssr: false }
);

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    setClickCount((prevCount) => prevCount + 1);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col items-center justify-center w-full h-full bg-white overflow-hidden"
    >
      <div className="absolute w-full h-full flex flex-col items-center justify-center">
        <div className="font-noto text-3xl font-extrabold">터득</div>
        <div className="typo-sub-title">Toudeuk</div>
        <div className="relative">
          <LottieAnimation
            animationData={CUSTOM_ICON.mainCircle}
            loop={true}
            width={400}
            height={400}
            autoplay={true}
          />
          <div className="absolute top-[90px] left-1/4 transform -translate-x-1/4">
            <Login />
          </div>
        </div>
        <div className="text-gray-400 font-noto">터득이란?</div>
      </div>
    </div>
  );
}
