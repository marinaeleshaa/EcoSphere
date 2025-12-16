"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function MotionItem({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
