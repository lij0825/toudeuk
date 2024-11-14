import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";

export default function Reindeer() {
  return (
    <>
      <LottieAnimation
        animationData={CUSTOM_ICON.reindeer}
        loop={true}
        width={40}
        height={40}
        autoplay={true}
      />
    </>
  );
}
