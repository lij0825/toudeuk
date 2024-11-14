import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Reindeer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%", // 부모 컨테이너 크기 설정
        height: 120, // Lottie 애니메이션 크기보다 약간 크게 설정
      }}
    >
      {containerWidth > 0 && (
        <motion.div
          initial={{ x: -100, rotateY: 180 }} // 애니메이션 시작 위치 조정
          animate={{
            x: [containerWidth + 100, -100], // LottieAnimation이 좌우 바깥으로 이동
            rotateY: [0, 180, 0], // 양 끝에서만 방향 전환
          }}
          transition={{
            duration: containerWidth / 20,
            ease: "easeInOut",
            repeat: Infinity,
            times: [0, 0.5, 1], // 양 끝에서만 rotateY 전환
          }}
          style={{
            position: "absolute", // 내부 애니메이션 요소가 부모 내에서 절대 위치 이동
          }}
        >
          <LottieAnimation
            animationData={CUSTOM_ICON.reindeer}
            loop={true}
            width={100}
            height={100}
            autoplay={true}
          />
        </motion.div>
      )}
    </div>
  );
}
