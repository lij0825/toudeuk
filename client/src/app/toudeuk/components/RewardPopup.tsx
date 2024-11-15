import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RewardType } from "@/types";
import { REWARD_CONFIGS } from "../constant/RewardConfig";
import { PopupAlert } from "@/app/components/PopupAlert";

interface RewardPopupProps {
  type: RewardType;
  isVisible: boolean;
}

const RewardPopup = ({ type, isVisible }: RewardPopupProps) => {
  const config = REWARD_CONFIGS[type];

  if (type === RewardType.NON || !isVisible || !config) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        key="reward-popup"
      >
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative"
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: config.scale, y: 0 }}
          exit={{ scale: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <motion.div
            animate={{
              rotate: [0, -2, 2, -2, 0],
              scale: [1, 1.02, 1, 1.02, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <PopupAlert
              title={
                <motion.div className="flex items-center gap-2">
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    {config.icon}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {config.title}
                  </motion.span>
                </motion.div>
              }
              description={
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {config.description}
                </motion.span>
              }
              className={`
                  w-full max-w-md shadow-2xl border-2
                  ${config.bgColor}
                  ${config.borderColor}
                  text-white
                `}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RewardPopup;
