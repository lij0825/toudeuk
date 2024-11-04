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
}

// 함수 선언식으로 컴포넌트 정의
function LottieAnimation({
  animationData,
  loop = false,
  autoplay = false,
  width = 48,
  height = 48,
  padding = "0",
  margin = "0",
}: LottieAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const handleClick = () => {
    if (lottieRef.current) {
      lottieRef.current?.play(); // 클릭 시 재생
    }
  };

  const handleMouseEnter = () => {
    lottieRef.current?.play(); // 호버 시 재생
  };

  const handleMouseLeave = () => {
    if (lottieRef.current) {
      lottieRef.current.stop(); // 애니메이션 정지
      lottieRef.current.goToAndStop(0, true); // 첫 프레임으로 초기화
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width, height, padding, margin, cursor: "pointer" }} // 원하는 크기 설정
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop} // props로 받은 loop 값 사용
        autoplay={autoplay} // props로 받은 autoplay 값 사용
        style={{ width: "100%", height: "100%" }} // 부모 div에 맞게 조절
      />
    </div>
  );
}

export default LottieAnimation;
