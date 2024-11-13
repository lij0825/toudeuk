import { HistoryRewardInfo } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface EndGameProps {
  remainingTime: number; // 초 단위
  remainingMilliseconds: number; // 밀리초 단위
  reward: HistoryRewardInfo;
  gameId: number;
}

export default function EndGame({
  remainingTime,
  remainingMilliseconds,
  reward,
  gameId,
}: EndGameProps) {
  return (
    // 최상단 div
    <div
      className="relative w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-40 backdrop-blur-md"
      style={{ zIndex: 100 }}
    >
      {/* 남은 시간 표시 섹션 */}
      <motion.div
        className="absolute top-20 flex flex-col justify-center items-center text-white font-bold  text-center text-2xl mb-2 blue-glow-text bg-white bg-opacity-20 backdrop-blur-md p-4 pb-2 rounded-xl shadow-lg border border-opacity-30 border-white"
        animate={
          remainingTime <= 30
            ? remainingTime <= 20
              ? {
                  x: [0, -8, 8, -8, 8, 0],
                  rotate: [0, -5, 5, -5, 5, 0],
                  transition: {
                    type: "keyframes",
                    duration: 1,
                    repeat: Infinity,
                  },
                }
              : {
                  x: [0, -5, 5, -5, 5, 0],
                  rotate: [0, -3, 3, -3, 3, 0],
                  transition: {
                    type: "keyframes",
                    duration: 2,
                    repeat: Infinity,
                  },
                }
            : {}
        }
      >
        <div className="typo-sub-title">NEXT GAME</div>
        <div
          className={
            remainingTime <= 20
              ? "text-red-500 font-bold"
              : remainingTime <= 30
              ? "text-yellow-500 font-semibold"
              : "text-white"
          }
        >
          {remainingTime <= 20 ? (
            <>
              <div>
                {remainingTime}초 {remainingMilliseconds}ms
              </div>
              <div>서두르세요!</div>
            </>
          ) : remainingTime <= 30 ? (
            <>
              <div>
                {remainingTime}초 {remainingMilliseconds}ms
              </div>
              <div>곧 시작합니다!</div>
            </>
          ) : (
            `${remainingTime}초`
          )}
        </div>
      </motion.div>

      {/* 게임 결과 보여주는 section */}

      <section className="flex flex-col justify-center text-center">
        {/* 게임 내역 표시 섹션 */}
        <AnimatePresence>
          {/* 애니메이션이 들어간 실제 div */}
          <motion.div
            className="relative z-10 flex flex-col items-center bg-white bg-opacity-20 backdrop-blur-lg shadow-lg text-center border border-opacity-20 border-white w-full w-full font-noto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
          >
            {/* 동전 이미지 - 라운드 결과 뒤로 배치 */}
            <div className="absolute z-5 top-0">
              <Image
                src={"/icons/maincoin.png"}
                width={200}
                height={200}
                alt="CoinIcon"
                className="opacity-80"
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>

            {/* 라운드 결과 헤드 */}
            <motion.div
              className="w-full text-white p-4 rounded-lg relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="typo-title font-bold relative z-10">
                {gameId} ROUND
              </p>
            </motion.div>

            {/* 보상자 섹션 */}
            {reward && (
              <>
                <div className="flex grid-1 gap-3">
                  {/* 우승자 */}
                  <div className="flex flex-col items-center">
                    <span className="text-white font-bold">우승자</span>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={reward.winner.profileImg}
                        width={100}
                        height={100}
                        alt="WinnerProfile"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-white">{reward.winner.nickname}</span>
                  </div>

                  {/* 첫 클릭자 */}
                  <div className="flex flex-col items-center">
                    <span className="text-white font-bold">첫 클릭자</span>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={reward.firstClicker.profileImg}
                        width={100}
                        height={100}
                        alt="FirstClickerProfile"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-white">
                      {reward.firstClicker.nickname}
                    </span>
                  </div>

                  {/* 최다 클릭자 */}
                  <div className="flex flex-col items-center">
                    <span className="text-white font-bold">최다 클릭자</span>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={reward.maxClicker.profileImg}
                        width={100}
                        height={100}
                        alt="CoinIcon"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-white">
                      {reward.maxClicker.nickname}
                    </span>
                  </div>
                </div>
                {/* 중간 보상자 */}
                <div className="text-white text-lg font-semibold mt-4 mb-2 blue-glow-text">
                  중간 보상자
                </div>
                <motion.ul
                  className="text-white text-sm grid grid-cols-5 gap-2 blue-glow-text text-center"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                >
                  {reward.middleRewardUsers.map((user, index) => (
                    <li key={index} className="flex flex-col items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-2">
                        <Image
                          src={user.profileImg}
                          width={50}
                          height={50}
                          alt="MiddleRewardUserProfile"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold">
                        {user.clickCount}번째
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
