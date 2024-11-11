import { motion, AnimatePresence } from "framer-motion";
import { RankInfo } from "@/types";

interface RankingProps {
    ranking: RankInfo[];
}

export default function Ranking({ ranking }: RankingProps) {
    return (
        <AnimatePresence>
            {ranking.length > 0 ? (
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
                            transition={{ duration: 0.5 }}
                            className="text-sm text-[#ff00ff] p-2 border-b border-gray-200"
                        >
                            {index + 1}위: {user.nickname} - 점수: {user.score}
                        </motion.li>
                    ))}
                </motion.ul>
            ) : (
                <p>랭킹 정보가 없습니다.</p>
            )}
        </AnimatePresence>
    );
}