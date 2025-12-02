"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Recycle, BookOpenText } from "lucide-react";

// 1. Reveal Animation Wrapper
const Reveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const Metrics = () => {
  const metricsData = [
    { label: "Tons Recycled", value: "1,500+" },
    { label: "Partners", value: "450+" },
    { label: "Waste Diverted", value: "92%" },
  ];

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center space-y-4 mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-primary">
              <BookOpenText className="w-4 h-4" /> Our Foundation
            </span>
            <h2 className="text-3xl md:text-5xl font-bold">
              The{" "}
              <span className="text-primary relative inline-block">
                Story
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-20"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              Behind Our Mission
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Our journey began with a simple observation: recyclable
                materials were ending up in landfills due to inconvenient
                processes. We set out to change that by building a dedicated
                logistics network.
              </p>
              <p>
                We created a platform that connects individuals directly to the
                recycling stream, ensuring resource efficiency and minimizing
                environmental harm.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 transform translate-x-10 translate-y-10"></div>
              <div className="relative bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-xl overflow-hidden">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Recycle className="w-6 h-6 text-primary" /> Impact Metrics
                </h4>
                <div className="space-y-6">
                  {metricsData.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                    >
                      <span className="font-medium text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Decorative metrics illustration (use recycle1.png) */}
                <div className="absolute -top-6 -right-6 w-44 h-32 pointer-events-none opacity-95">
                  <Image
                    src="/recycle1.png"
                    alt="metrics-illustration"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
