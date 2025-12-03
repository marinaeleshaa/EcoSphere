"use client";

import React from "react";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About.story');

  return (
    <section className="relative w-full bg-card text-card-foreground py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* LEFT COLUMN: Images & Decorative Elements */}
          <div className="relative">
            {/* Primary color decorative sidebar line */}
            <div className="absolute -left-4 top-10 bottom-10 w-1.5 rounded-full hidden md:block" style={{ background: 'var(--primary)' }} />

            <div className="relative pl-4 md:pl-8">
              {/* Main Image  */}
              <div className="relative z-10 overflow-hidden rounded-xl p-4 bg-card/50 border border-theme shadow-lg transform transition-transform hover:scale-[1.02] duration-500 ring-2 ring-primary/40 dark:ring-primary/60 dark:shadow-primary/30">
                <div className="relative w-full h-full min-h-80 md:min-h-[350px]">
                  <Image
                    src="/story.png"
                    alt="Sustainable Community"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Overlay Card (Illustration) */}
            <div className="absolute -bottom-6 -right-4 z-20 md:-bottom-10 md:-right-10 w-48 md:w-64 bg-card p-3 rounded-xl shadow-2xl border border-theme">
              <div className="relative w-full h-32 md:h-40">
                <Image
                  src="/story1.png"
                  alt="Community planting illustration"
                  fill
                  className="rounded-lg object-contain"
                  unoptimized
                />
              </div>
            </div>

          </div>
          {/* RIGHT COLUMN: Content */}
          <div className="flex flex-col space-y-6 lg:pl-8">
            <div className="space-y-2">
              <span className="text-xl font-bold tracking-widest text-primary uppercase">{t('label')}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                <motion.span initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="inline-block mr-3">
                  <Globe size={28} />
                </motion.span>
                {t('title')}
              </h2>
            </div>

            <p className="text-muted leading-relaxed">
              {t('description')}
            </p>

          </div>
        </div>
      </div>
    </section >
  );
}