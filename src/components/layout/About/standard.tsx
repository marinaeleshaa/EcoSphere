"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { ClipboardCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Standard() {
  return (
    <section className="relative w-full bg-card text-card-foreground py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-[80%] px-4 md:px-6">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: Content */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <span className="text-xl font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                  <motion.span initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center">
                    <ClipboardCheck className="w-4 h-4" />
                  </motion.span>
                  Verification
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  The EcoSphere <br />
                  <span className="text-primary">Verification.</span>
                </h2>
              </div>

              <div className="space-y-6 text-muted text-lg leading-relaxed">
                <p>
                  In an age of greenwashing, we believe verification is mandatory. 
                  The EcoSphere Standard is our rigorous <strong className="text-foreground">multi-point review system </strong> 
                  ensuring every product listed meets strict verifiable criteria. 
                  This transforms our promise of sustainability into a demonstrable process.
                </p>
                
                <p>
                 Every partner must pass a structured verification system combining documentation, third-party certifications, and sustainability assessments across four pillars:
                </p>

                {/* Feature List */}
                <ul className="space-y-3 pt-2">
                  {[
                    "Documentation Review",
                    "Third-Party Certification Assessment",
                    "Detailed Impact Questionnaire",
                    "Continuous Compliance Monitoring"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-[var(--primary-foreground)/0.12] flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-foreground font-medium text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT COLUMN: Image & Decor */}
            <div className="relative pl-4 md:pl-8">
              {/* Primary color decorative sidebar line */}
              <div className="absolute left-0 top-10 bottom-10 w-1.5 rounded-full hidden md:block" style={{ background: 'var(--primary)' }} />

              {/* Decorative circular lines overlay */}
              <div className="absolute -bottom-10 -right-10 z-0 opacity-10">
                 <div className="w-48 h-48 rounded-full border-8 border-dotted animate-spin-slow" style={{ borderColor: 'var(--primary)' }} />
              </div>

              {/* Main Image Container */}
              <motion.div className="relative z-10 overflow-hidden rounded-xl p-4 bg-card/50 border border-theme shadow-lg transform transition-transform hover:scale-[1.02] duration-500 ring-2 ring-primary/40 dark:ring-primary/60 dark:shadow-primary/30"
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
                <div className="relative w-full h-full min-h-80 md:min-h-[360px]">
                  <Image
                    src="/standard.png"
                    alt="Standard Illustration"
                    fill
                    className="object-contain"
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