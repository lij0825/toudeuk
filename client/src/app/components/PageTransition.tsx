"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface PageTrnasitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTrnasitionProps) {
  const pathname = usePathname();

  //   component에 framer 모션 적용을 위해 motion.div 작성
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
