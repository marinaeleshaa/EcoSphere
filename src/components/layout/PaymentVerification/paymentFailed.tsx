"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, RefreshCcw, AlertOctagon } from "lucide-react";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.4, 0, 0.2, 1] as const
    } 
  }
};

const shakeIcon = {
  hidden: { x: 0 },
  visible: {
    x: [0, -8, 8, -8, 8, 0],
    transition: { 
      duration: 0.6, 
      delay: 0.2,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

export default function PaymentFailure() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[90%] sm:max-w-md p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border-4 border-accent-foreground/20 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          
          {/* Error Icon */}
          <div className="relative">
            <motion.div 
              variants={shakeIcon}
              initial="hidden"
              animate="visible"
              className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-accent-foreground/30 shadow-lg"
            >
              <X className="w-10 h-10 sm:w-10 sm:h-10 text-accent-foreground" strokeWidth={5} />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-primary/10 rounded-full p-1.5 sm:p-2 shadow-md border-2 border-accent-foreground/20">
              <AlertOctagon className="w-5 h-5 sm:w-6 sm:h-6  text-accent-foreground/80" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2 sm:space-y-3 px-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-accent-foreground">Payment Failed</h2>
            <p className="text-accent-foreground/70 font-medium text-base sm:text-lg leading-relaxed">
              We encountered an issue processing your eco-contribution. No funds were deducted.
            </p>
          </div>

          {/* Error Details */}
          <div className="w-full bg-primary/10 rounded-2xl p-4 border border-accent-foreground/20 flex items-start gap-3 text-left">
            <div className="mt-0.5 min-w-5">
              <div className="w-1.5 h-1.5 rounded-full mt-2" />
            </div>
            <div className="flex-1">
              <p className="text-l font-bold uppercase text-accent-foreground tracking-wider mb-1">Error Code: 402</p>
              <p className="text-sm font-semibold text-accent-foreground/80">
                Card declined. Please check your card details or try a different payment method.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full space-y-3">
            <button className="w-full group flex items-center justify-center gap-2 py-3 sm:py-4 px-6 rounded-full border-2 border-accent-foreground/30 text-accent-foreground font-semibold hover:bg-accent-foreground/10 transition-colors">
              Try Again 
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}