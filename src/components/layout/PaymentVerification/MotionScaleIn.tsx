"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export function MotionScaleIn({
  children,
  className,
  variant = "scale",
}: Readonly<{ children: ReactNode; className: string; variant: string }>) {
  const variants: Variants =
    variant === "shake"
      ? {
          hidden: { x: 0 },
          visible: {
            x: [0, -8, 8, -8, 8, 0],
            transition: { duration: 0.6, delay: 0.2 },
          },
        }
      : {
          hidden: { scale: 0 },
          visible: {
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 15 },
          },
        };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
