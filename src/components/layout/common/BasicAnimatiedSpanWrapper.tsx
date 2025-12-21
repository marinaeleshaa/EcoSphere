"use client";

import { motion, TargetAndTransition, VariantLabels } from "framer-motion";

const BasicAnimatedSpanWrapper = ({
  children,
  index,
  className,
  whileHover,
  delay,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  whileHover?: TargetAndTransition | VariantLabels;
  delay?: number;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: index! * 0.2 || delay || 0 }}
      // viewport={{ once: false }}
      whileHover={whileHover}
      className={className}
    >
      {children}
    </motion.span>
  );
};

export default BasicAnimatedSpanWrapper;
