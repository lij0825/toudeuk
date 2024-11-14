import { motion, AnimatePresence } from "framer-motion";
import { RankInfo } from "@/types";

interface RankingProps {
  ranking: RankInfo[];
}

export default function Ranking({ ranking }: RankingProps) {
  return (
    <AnimatePresence>
      {ranking.length > 0 ? (
        <>
          <h3 className="text-md font-extrabold font-noto text-white mb-2 w-full text-center">
            실시간 클릭 순위
          </h3>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="list-none p-0"
          >
            {ranking.map((user, index) => (
              <motion.li
                key={user.nickname}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                layout
                transition={{ duration: 0.3 }}
                className="text-sm mb-2 shadow-xl"
                style={{
                  borderRadius: "4px",
                  background: `rgba(255, 255, 255, ${
                    0.1 + (10 - index) * 0.025
                  })`, // 더 투명한 배경, 하위로 갈수록 투명도 증가
                  padding: "8px",
                  color: `rgba(255, 255, 255, ${0.8 + (10 - index) * 0.01})`, // 상위 순위일수록 더 밝게
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)", // 그림자를 조금 줄임
                  border: "1px solid rgba(255, 255, 255, 0.08)", // 은은한 테두리
                  backdropFilter: "blur(12px) saturate(150%)", // 블러와 채도 증가
                }}
              >
                <span
                  className={`${index + 1 <= 3 ? "font-bold" : ""} text-base`}
                >
                  {index + 1}위
                </span>{" "}
                {user.nickname} - {user.score}
              </motion.li>
            ))}
          </motion.ul>
        </>
      ) : (
        <p>랭킹 정보가 없습니다.</p>
      )}
    </AnimatePresence>
  );
}
