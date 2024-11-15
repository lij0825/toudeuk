import LottieAnimation from "@/app/components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";
import { useRef, useState, useEffect } from "react";

export default function Reindeer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reindeerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [movingRight, setMovingRight] = useState(true);
  const animationDuration = 5;

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

  useEffect(() => {
    if (!reindeerRef.current || !containerWidth) return;

    reindeerRef.current.style.animation = movingRight
      ? `move-right ${animationDuration}s linear forwards`
      : `move-left ${animationDuration}s linear forwards`;

    const timer = setInterval(() => {
      setMovingRight((prev) => !prev);
    }, animationDuration * 1000);

    return () => clearInterval(timer);
  }, [movingRight, containerWidth]);

  const keyframes = `
    @keyframes move-right {
      0% {
        transform: translateX(-100px) scaleX(-1);
      }
      100% {
        transform: translateX(${containerWidth + 100}px) scaleX(-1);
      }
    }

    @keyframes move-left {
      0% {
        transform: translateX(${containerWidth + 100}px) scaleX(1);
      }
      100% {
        transform: translateX(-100px) scaleX(1);
      }
    }
  `;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[120px] overflow-hidden"
    >
      {containerWidth > 0 && (
        <>
          <style>{keyframes}</style>
          <div
            ref={reindeerRef}
            className="absolute w-[100px] h-[100px]"
            style={{
              animation: `${
                movingRight ? "move-right" : "move-left"
              } ${animationDuration}s linear forwards`,
            }}
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.reindeer}
              loop={true}
              width={100}
              height={100}
              autoplay={true}
            />
          </div>
        </>
      )}
    </div>
  );
}
