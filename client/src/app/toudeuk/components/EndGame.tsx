import { HistoryRewardInfo } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface EndGameProps {
  remainingTime: number; // 초 단위
  remainingMilliseconds: number; // 밀리초 단위
  reward?: HistoryRewardInfo; // reward가 undefined일 수도 있음
}

export default function EndGame({
  remainingTime,
  remainingMilliseconds,
  reward,
}: EndGameProps) {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-lg flex flex-col justify-center items-center select-none pointer-events-none"
      style={{ zIndex: 100 }}
    >
      <motion.div
        className="flex flex-col justify-center items-center text-white font-bold text-center text-2xl blue-glow-text bg-white bg-opacity-20 backdrop-blur-md p-4 pb-4 rounded-xl shadow-lg border border-opacity-30 border-white"
        style={{ zIndex: 101 }}
        initial={{ y: 100, opacity: 0 }} // 화면 아래에 시작 위치
        animate={{
          y: 0,
          opacity: 1,
          ...(remainingTime <= 20
            ? remainingTime <= 15
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
            : {}),
        }}
        transition={{
          type: "spring",
          stiffness: 150, // 탄성 정도
          damping: 12, // 반동의 감쇠 정도
        }}
      >
        <div className="typo-sub-title">NEXT GAME</div>
        <div
          className={
            remainingTime <= 15
              ? "text-red-500 font-bold"
              : remainingTime <= 20
              ? "text-yellow-500 font-semibold"
              : "text-white"
          }
        >
          {remainingTime <= 15 ? (
            <>
              <div className="mt-1">
                {remainingTime}초 {remainingMilliseconds}ms
              </div>
              <div>서두르세요!</div>
            </>
          ) : remainingTime <= 20 ? (
            <>
              <div>
                {remainingTime}초 {remainingMilliseconds}ms
              </div>
              <div className="mt-1">곧 시작합니다!</div>
            </>
          ) : (
            `${remainingTime}초`
          )}
        </div>
      </motion.div>

      <section className="flex flex-col justify-center text-center w-full mt-5 font-noto">
        <AnimatePresence>
          <motion.div
            className="flex flex-col items-center bg-white bg-opacity-20 backdrop-blur-lg shadow-lg text-center border border-opacity-20 border-white w-full pb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
          >
            <motion.div
              className="typo-title font-bold p-4 bg-black-900 bg-opacity-70 text-white w-full relative overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                color: "#FFFFFF",
                textShadow:
                  "0 0 10px rgba(255, 215, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.5)",
              }}
            >
              ROUND SET !!
            </motion.div>

            <div className="flex grid-1 gap-5 my-4">
              {/* 최다 클릭자 */}
              <div className="flex flex-col items-center justify-center gap-1 relative">
                <div className="text-white font-bold">최다 클릭자</div>
                <div className="relative w-24 h-24">
                  <div className="absolute top-4 left-5 w-14 h-14 rounded-full overflow-hidden z-0">
                    <Image
                      src={
                        reward?.maxClicker?.profileImg || "/default_profile.jpg"
                      }
                      width={100}
                      height={100}
                      alt="MaxClickerProfile"
                      className="object-cover cursor-default"
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-24 h-24 rounded-full overflow-hidden z-10">
                    <Image
                      src={"/user/maxclicker.png"}
                      width={100}
                      height={100}
                      alt="MaxClickerBackground"
                      className="object-cover cursor-default"
                    />
                  </div>
                </div>
                <div className="text-white">
                  {reward?.maxClicker?.nickname || "정보 없음"}
                </div>
              </div>

              {/* 우승자 */}
              <div className="flex flex-col items-center justify-center gap-1 relative">
                <span className="text-white font-extrabold text-xl">
                  우승자
                </span>
                <div className="relative w-24 h-24">
                  <div className="absolute top-4 left-5 w-14 h-14 rounded-full overflow-hidden z-0">
                    <Image
                      src={reward?.winner?.profileImg || "/default_profile.jpg"}
                      width={100}
                      height={100}
                      alt="WinnerProfileBackground"
                      className="object-cover cursor-default"
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-24 h-24 rounded-full overflow-hidden z-10">
                    <Image
                      src={"/user/winner.png"}
                      width={150}
                      height={150}
                      alt="WinnerProfile"
                      className="object-cover cursor-default"
                    />
                  </div>
                </div>
                <span className="text-white font-xl">
                  {reward?.winner?.nickname || "정보 없음"}
                </span>
              </div>

              {/* 첫 클릭자 */}
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-white font-bold">첫 클릭자</span>
                <div className="relative w-[94px] h-[94px]">
                  <div className="absolute top-3 left-4 w-14 h-14 rounded-full overflow-hidden z-0">
                    <Image
                      src={
                        reward?.firstClicker?.profileImg ||
                        "/default_profile.jpg"
                      }
                      width={100}
                      height={100}
                      alt="FirstClickerProfile"
                      className="object-cover cursor-default"
                    />
                  </div>
                  <div className="absolute -top-1 -left-1 w-24 h-24 rounded-full overflow-hidden z-10">
                    <Image
                      src={"/user/first.png"}
                      width={150}
                      height={150}
                      alt="FirstClickerBackground"
                      className="object-cover cursor-default"
                    />
                  </div>
                </div>
                <span className="text-white">
                  {reward?.firstClicker?.nickname || "정보 없음"}
                </span>
              </div>
            </div>

            <section>
              <div className="text-white text-xl font-semibold mb-4">
                중간 보상
              </div>
              <motion.ul
                className={`text-white text-sm ${
                  reward?.middleRewardUsers?.length &&
                  reward.middleRewardUsers.length > 5
                    ? "grid grid-cols-5 gap-3"
                    : "flex justify-center items-center gap-5 flex-wrap"
                } blue-glow-text text-center`}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                }}
              >
                {reward?.middleRewardUsers?.length ? (
                  reward.middleRewardUsers.map((user, index) => (
                    <li
                      key={index}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden">
                        <Image
                          src={user.profileImg || "/default_profile.jpg"}
                          width={50}
                          height={50}
                          alt="MiddleRewardUserProfile"
                          className="object-cover"
                          style={{ cursor: "default" }}
                        />
                      </div>
                      <span className="font-semibold">{user.nickname}</span>
                    </li>
                  ))
                ) : (
                  <span className="text-white text-sm">정보 없음</span>
                )}
              </motion.ul>
            </section>
          </motion.div>
        </AnimatePresence>
      </section>
      <section className="p-1 flex-shrink-0 h-[62px]"></section>
    </div>
  );
}
