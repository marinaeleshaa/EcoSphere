"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function MotionLeaf({
  children,
  className,
}: Readonly<{ children: ReactNode; className: string }>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0, rotate: -45 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
