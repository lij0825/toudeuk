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
                className="text-sm p-4 mb-2 border rounded-lg shadow-xl"
                style={{
                  background: `rgba(255, 255, 255, ${
                    0.15 + (10 - index) * 0.03
                  })`, // 더 투명한 배경
                  color: `rgba(255, 255, 255, ${0.85 + (10 - index) * 0.015})`, // 상위 순위일수록 더 밝게
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)", // 그림자를 조금 줄여 자연스럽게
                  border: "1px solid rgba(255, 255, 255, 0.1)", // 은은한 테두리
                  borderRadius: "18px",
                  padding: "14px",
                  backdropFilter: "blur(15px) saturate(180%)", // 블러와 채도 증가로 더 선명한 글래스모피즘 느낌
                }}
              >
                <span className="font-bold">{index + 1}위</span> {user.nickname}{" "}
                - {user.score}
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
