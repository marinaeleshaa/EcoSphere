"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Home, Leaf, Download } from "lucide-react";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.15 
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  }
};

const leafVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -45 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 100, 
      delay: 0.3 
    } 
  }
};

export default function PaymentSuccess() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
     
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative z-10 border-4 border-accent-foreground/20"
      >
       

        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Success Icon Group */}
          <div className="relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring" as const,
                stiffness: 200, 
                damping: 15 
              }}
              className="w-24 h-24 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner border border-accent-foreground/30"
            >
              <Check className="w-12 h-12 text-accent-foreground drop-shadow-sm" strokeWidth={3} />
            </motion.div>
            
            {/* Floating Leaves */}
            <motion.div variants={leafVariants} className="absolute -top-2 -right-2 text-accent-foreground/80">
              <Leaf className="w-8 h-8 fill-current" />
            </motion.div>
            <motion.div 
              variants={leafVariants} 
              className="absolute -bottom-1 -left-4 text-accent-foreground/40 rotate-45"
            >
              <Leaf className="w-6 h-6 fill-current" />
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-accent-foreground">Payment Confirmed</h2>
            <p className="text-accent-foreground/80 font-medium text-lg">
              Thank you for contributing to a greener future.
            </p>
          </motion.div>

          {/* Receipt Card */}
          <motion.div 
            variants={itemVariants}
            className="w-full bg-primary/10 rounded-2xl p-5 border-4 border-accent-foreground/10 space-y-4 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center border-b-4 border-accent-foreground/30 pb-3">
              <span className="text-sm font-medium text-accent-foreground/80">Transaction ID</span>
              <span className="font-mono text-sm font-bold text-accent-foreground">#ECO-8829</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-accent-foreground/80">Total Amount</span>
              <span className="text-2xl font-bold text-accent-foreground">$25.00</span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="w-full space-y-3">
            <button className="w-full group flex items-center justify-center gap-2 py-4 px-6 rounded-full border-2 border-accent-foreground/30 text-accent-foreground font-bold hover:bg-accent-foreground/10 transition-colors">
              Return Home <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            
            <button className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full  border-2 border-primary/30 text-accent-foreground font-bold hover:bg-accent-foreground/10 transition-colors">
              Download Receipt <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}