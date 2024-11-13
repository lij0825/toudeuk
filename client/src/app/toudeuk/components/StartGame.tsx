import { AnimatePresence, motion } from "framer-motion";

interface StartGameProps {
  remainingTime: number;
}

export default function StartGame({ remainingTime }: StartGameProps) {
  return (
    <>
      {/* 배경 블러 처리 */}
      <div className="absolute inset-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-lg" style={{ zIndex: 100 }}></div>

      {/* 숫자 또는 "GameStart" 텍스트 애니메이션 적용 */}
      <AnimatePresence>
        <motion.div
          key={remainingTime}
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          exit={{ x: "-100vw" }}
          transition={{ duration: 0.5 }}
          style={{ zIndex: 101 }}
        >
          <p
            className={`text-white font-bold ${
              remainingTime === 0 ? "text-5xl" : "text-9xl"
            }`}
          >
            {remainingTime === 0 ? "GameStart" : remainingTime}
          </p>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
