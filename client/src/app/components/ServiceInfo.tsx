"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowCircleLeft, FaArrowCircleRight, FaTimes } from "react-icons/fa";

const slides = [
  {
    title: "포인트를 충전하고\n터치게임에 참여하세요!",
    description: "포인트를 충전하고 \n 게임에 참가할 수 있어요.",
    imgSrc: "/toudeuk/game.png",
    textColor: "text-blue-600",
  },
  {
    title: "다양한 보상\n포인트를 획득하세요!",
    description: "1000번째 최종 클릭자\n최다 클릭자\n구간별 중간 보상자까지!",
    imgSrc: "/toudeuk/reward.png",
    textColor: "text-green-600",
  },
  {
    title: "당첨된 포인트로\n기프티콘까지!",
    description: "획득한 포인트를 통해\n기프티콘을 구매할 수 있어요.",
    imgSrc: "/toudeuk/gifticon.png",
    textColor: "text-purple-600",
  },
];

export default function ServiceInfo({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const handleKakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭됨");

    // window.location.href = `http://toudeuk.kr:8080/oauth2/authorization/kakao?redirect_uri=https://toudeuk.kr`;
    // window.location.href = `http://toudeuk.kr:8080/oauth2/authorization/kakao?redirect_uri=https://toudeuk.kr`;
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao?redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}`;
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const touchX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(touchX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === null) return;
    const endX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;

    if (startX - endX > 50) {
      nextSlide();
    } else if (endX - startX > 50) {
      prevSlide();
    }

    setStartX(null);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  return (
    <div
      className="absolute inset-0 bg-white flex items-center justify-start z-50 font-noto"
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full flex flex-col pt-8">
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
          <p className="text-gray-600 text-lg font-semibold">
            {currentSlide + 1} / {slides.length}
          </p>
        </div>

        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl z-10"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="relative flex justify-center items-center h-full overflow-hidden px-4">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute flex flex-col items-center justify-start h-full text-center pt-8 p-4 max-w-2xl mx-auto"
            >
              <h2
                className={`text-2xl md:text-4xl font-bold mb-4 ${slides[currentSlide].textColor} whitespace-pre-line`}
              >
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm md:text-lg text-gray-700 mb-4 whitespace-pre-line">
                {slides[currentSlide].description}
              </p>
              <Image
                src={slides[currentSlide].imgSrc}
                alt="Slide Image"
                className="mt-4 rounded-lg shadow-lg w-[80%] max-w-md"
                width={400}
                height={300}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-3xl z-10"
          onClick={prevSlide}
        >
          <FaArrowCircleLeft />
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-3xl z-10"
          onClick={nextSlide}
        >
          <FaArrowCircleRight />
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex flex-col justify-center w-full px-4 pb-4 z-10 font-noto">
          <div className="text-center pb-2 text-sm md:text-base">
            지금 가입하면 무료 1000pt 지급!
          </div>
          <button
            className="text-black font-extrabold px-6 py-3 rounded-md shadow w-full bg-[#FEE500] transition"
            onClick={handleKakaoLogin}
          >
            지금 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
