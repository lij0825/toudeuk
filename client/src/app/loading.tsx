"use client";

import { CUSTOM_ICON } from "@/constants/customIcons";
import LottieAnimation from "@/app/components/LottieAnimation";

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LottieAnimation
        animationData={CUSTOM_ICON.littleLoading}
        loop={true}
        width={300}
        height={250}
        autoplay={true}
      />
    </div>
  );
};

export default Loading;
