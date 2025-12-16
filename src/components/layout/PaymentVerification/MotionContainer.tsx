"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function MotionContainer({
  children,
  className,
}: Readonly<{ children: ReactNode; className: string }>) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { staggerChildren: 0.15 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
