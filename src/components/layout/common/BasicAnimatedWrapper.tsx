"use client";

import { motion } from "framer-motion";

const BasicAnimatedWrapper = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index! * 0.1 || 0 }}
      viewport={{ once: false }}
    >
      {children}
    </motion.div>
  );
};

export default BasicAnimatedWrapper;
