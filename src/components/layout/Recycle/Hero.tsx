"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative w-full">
      <div className="relative w-full h-[450px] md:h-[520px] lg:h-[600px] bg-primary/5 dark:bg-primary/10 overflow-hidden flex items-center justify-center">
      
        {/* Hero illustration (right side) */}
        <div className="absolute right-4 top-8 hidden md:block w-1/2 h-full pointer-events-none opacity-95">
          <Image
            src="/recycle2.png"
            alt="recycle-hero"
            fill
            className="object-contain"
          />
        </div>


        {/* Hero Content */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-[90%] md:w-[70%] max-w-4xl text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            A Greener Tomorrow <br className="hidden md:block" /> Starts Today
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto leading-relaxed">
            Join us in our mission to revolutionize waste management and build a
            sustainable future for our planet. Every piece counts.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
