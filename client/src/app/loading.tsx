"use client";

import { CUSTOM_ICON } from "@/constants/customIcons";
import LottieAnimation from "@/app/components/LottieAnimation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Loading = () => {
  const pathname = usePathname();

  if (pathname === "/toudeuk") {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="typo-sub-title">Loading....</div>
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
