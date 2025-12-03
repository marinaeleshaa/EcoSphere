"use client";

import { motion, TargetAndTransition, VariantLabels } from "framer-motion";

const BasicAnimatedWrapper = ({
  children,
  index,
  className,
  whileHover,
  delay
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  whileHover?: TargetAndTransition | VariantLabels;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index! * 0.2 || delay || 0 }}
      viewport={{ once: false }}
      whileHover={whileHover}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default BasicAnimatedWrapper;
