"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Mission() {
  return (
    <section className="relative w-full bg-card text-card-foreground py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-[80%] px-4 md:px-6">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: Content */}
            <div className="flex flex-col space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                  <motion.span initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center">
                    <Target className="w-4 h-4" />
                  </motion.span>
                  Our Mission
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  Making sustainability <br />
                  <span className="text-primary">effortless & trustworthy.</span>
                </h2>
              </div>

              {/* Summarized Text */}
              <div className="space-y-6 text-muted text-lg leading-relaxed">
                <p>
                  EcoSphere exists to bridge the gap between conscious consumers and ethical enterprises. 
                  We strip away the guesswork of &quot;greenwashing&quot; by providing a rigorously vetted marketplace 
                  where every choice is a verified step towards a better planet.
                </p>
                <div className="pl-6 border-l-4 border-theme space-y-4">
                  <div>
                    <strong className="block text-foreground">For Consumers</strong>
                    <span className="text-sm">Instant access to transparent, planet-first products without the research fatigue.</span>
                  </div>
                  <div>
                    <strong className="block text-foreground">For Businesses</strong>
                    <span className="text-sm">High-visibility growth for brands that prioritize integrity over easy profits.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Image & Decor */}
            <div className="relative order-1 lg:order-2 pl-4 md:pl-8">
              {/* Primary color decorative sidebar line similar to first component */}
              <div className="absolute left-0 top-10 bottom-10 w-1.5 rounded-full hidden md:block" style={{ background: 'var(--primary)' }} />

              {/* Decorative circular lines overlay */}
              <div className="absolute -top-6 -right-6 z-0 opacity-10">
                <div className="w-32 h-32 rounded-full border-4 border-dashed animate-spin-slow" style={{ borderColor: 'var(--primary)' }} />
              </div>

              {/* Main Image Container */}
              <motion.div className="relative z-10 overflow-hidden rounded-xl shadow-2xl transform transition-transform hover:scale-[1.01] duration-500"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
                <div className="relative w-full md:min-h-[500px] h-80">
                  <Image
                    src="/mission.png"
                    alt="EcoSphere Mission"
                    fill
                    className="object-cover"
                    onError={() => { /* no-op fallback: keep source as-is; public image expected */ }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}