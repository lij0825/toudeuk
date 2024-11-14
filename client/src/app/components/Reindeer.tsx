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

  console.log(containerWidth);

  return (
    <div
      ref={containerRef}
      style={{ overflow: "hidden", position: "relative" }}
    >
      {containerWidth > 0 && (
        <motion.div
          initial={{ x: containerWidth, rotateY: 180 }} // 오른쪽 끝에서 시작
          animate={{
            x: [containerWidth, -containerWidth, containerWidth], // 좌우 끝으로 반복
            rotateY: [180, 180, 0, 0, 180], // 양 끝에서만 방향 전환
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
            times: [0, 0.49, 0.5, 0.99, 1], // 양 끝에서만 rotateY 전환
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
