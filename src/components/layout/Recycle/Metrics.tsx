"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Recycle, Package, Users, BarChart4 } from "lucide-react";

// ---- Reveal Wrapper ----
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
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

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

// ---- Counter Component ----
const Counter = ({ value }: { value: number }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.floor(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 2, ease: "easeOut" });
    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span>{rounded}</motion.span>;
};

// ---- Main Component ----
export const Metrics = () => {
  const metrics = [
    { label: "Tons Recycled", value: 1500, suffix: "+", Icon: Package },
    { label: "Partners", value: 450, suffix: "+", Icon: Users },
    { label: "Waste Diverted", value: 92, suffix: "%", Icon: BarChart4 },
  ];

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <Reveal>
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 text-xl font-bold tracking-widest uppercase text-primary">
              <Recycle className="w-6 h-6" /> Our Impact
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Key Metrics
            </h2>
          </div>
        </Reveal>

        {/* Metric Cards */}
<Reveal delay={0.2}>
  <div className="grid md:grid-cols-3 gap-8">

    {metrics.map((item, index) => (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.6 }}
        viewport={{ once: true }}
         className={`
                relative 
                
                /* --- Stronger light-mode presence --- */
                bg-card 
                border border-primary-500/50 
                shadow-[0_4px_14px_rgba(0,0,0,0.08)] 
                hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] 
                
                rounded-4xl 
                p-8 md:p-10 
                text-center 
                flex flex-col 
                items-center 
                justify-center 
                space-y-4 
                transition-all duration-300
                hover:scale-[1.03]
              `}
            >
              {/* Subtle inner glow */}
              <div className="
                absolute inset-0 
                bg-primary/5 
                blur-xl 
                rounded-4xl 
                pointer-events-none 
              "></div>
        {/* Icon */}
              <item.Icon className={`w-10 h-10 mb-2 text-primary relative z-10`} />

        {/* Number */}
        <div className="text-3xl md:text-4xl font-extrabold text-primary relative z-10">
          <Counter value={item.value} />
          {item.suffix}
        </div>

        {/* Label */}
        <p className="text-lg font-medium text-foreground/80">
          {item.label}
        </p>
      </motion.div>
    ))}

  </div>
</Reveal>


      </div>
    </section>
  );
};

export default Metrics;
