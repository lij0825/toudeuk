import React, { useRef } from "react";
import Lottie, {
  LottieComponentProps,
  LottieRefCurrentProps,
} from "lottie-react";

interface LottieAnimationProps {
  animationData: LottieComponentProps["animationData"];
  loop?: boolean | number;
  autoplay?: boolean;
  width?: number;
  height?: number;
  padding?: string;
  margin?: string;
  cursor?: string; // cursor 속성을 추가
}

function LottieAnimation({
  animationData,
  loop = false,
  autoplay = false,
  width = 48,
  height = 48,
  padding = "0",
  margin = "0",
  cursor = "",
}: LottieAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const handleClick = () => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleMouseEnter = () => {
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (lottieRef.current) {
      lottieRef.current.stop();
      lottieRef.current.goToAndStop(0, true);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width, height, padding, margin, cursor }} // cursor를 style에 반영
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default LottieAnimation;
