"use client";

import Login from "./components/Login";
import { CUSTOM_ICON } from "@/constants/customIcons";
import LottieAnimation from "@/app/components/LottieAnimation";
import Image from "next/image";
import Title from "./mypage/components/Title";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-white overflow-hidden">
      <div className="absolute w-full h-full flex items-center justify-center">
        <div className="absolute top-16 flex flex-col items-center">
          <Title />
        </div>
        <div className="relative flex items-center justify-center">
          {/* Lottie Animation - 화면 중앙에 위치 */}
          <LottieAnimation
            animationData={CUSTOM_ICON.mainCircle}
            loop={true}
            width={400}
            height={400}
            autoplay={true}
          />

          {/* Login 버튼 - 왼쪽 하단에 배치 */}
          <div className="absolute top-[50px] left-[20px] transform translate-x-1/4 translate-y-1/4">
            <Login />
          </div>

          {/* 이미지 - 오른쪽 상단에 배치 */}
          <div className="absolute top-[-40px] right-[-20px]">
            <Image
              src={"/icons/santa.png"}
              width={200}
              height={200}
              alt="santa"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
