"use client";

import Login from "./components/Login";
import { CUSTOM_ICON } from "@/constants/customIcons";
import LottieAnimation from "@/app/components/LottieAnimation";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-white overflow-hidden">
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
      </div>
    </div>
  );
}
