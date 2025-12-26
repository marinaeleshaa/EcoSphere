"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  threshold?: number; // renamed from rootMargin pattern
};

const Reveal = ({
  children,
  className = "",
  threshold = 0, // 0.0–1.0: how much must be visible to trigger animation
}: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const inView = useInView(ref, {
    amount: threshold,
    // once: true // uncomment if you want animation only the first time it becomes visible
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
