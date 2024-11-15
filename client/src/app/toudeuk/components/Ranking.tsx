import { motion, AnimatePresence } from "framer-motion";
import { RankInfo } from "@/types";

interface RankingProps {
  ranking: RankInfo[];
}

export default function Ranking({ ranking }: RankingProps) {
  const maxRanking = 15;

  return (
    <AnimatePresence>
      {ranking.length > 0 ? (
        <div className="w-[150px]" draggable="false">
          <h3 className="text-sm font-extrabold font-noto text-white mb-2 w-full text-center">
            실시간 순위
          </h3>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="list-none p-0 max-h-[70vh] overflow-y-auto"
          >
            {ranking.slice(0, maxRanking).map((user, index) => (
              <motion.li
                key={user.nickname}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                layout
                transition={{ duration: 0.3 }}
                className="text-xs mb-2 shadow-xl backdrop-blur-md h-[32px] flex items-center justify-between relative"
                style={{
                  borderRadius: "6px",
                  background:
                    index === 0
                      ? `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.25), 
                        rgba(255, 255, 255, 0.15))`
                      : `rgba(255, 255, 255, ${Math.max(
                          0.02,
                          0.15 - index * 0.01
                        )})`,
                  padding: "0 8px",
                  color: `rgba(255, 255, 255, ${Math.max(
                    0.3,
                    0.95 - index * 0.04
                  )})`,
                  boxShadow:
                    index === 0
                      ? "0 4px 16px rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.2)"
                      : "0 2px 8px rgba(0, 0, 0, 0.15)",
                  border:
                    index === 0
                      ? "1px solid rgba(255, 255, 255, 0.2)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center">
                  <span
                    className={`${index + 1 <= 3 ? "font-bold" : ""} ${
                      index === 0 ? "text-yellow-300" : ""
                    } mr-2`}
                  >
                    {index + 1}
                  </span>
                  <span className="max-w-[80px] truncate">{user.nickname}</span>
                </div>
                <span className="ml-2">{user.score}</span>
                {index === 0 && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 animate-pulse" />
                )}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      ) : (
        <p>랭킹 정보가 없습니다.</p>
      )}
    </AnimatePresence>
  );
}
