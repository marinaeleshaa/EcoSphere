"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function Vision() {
    const t = useTranslations('About.vision');

    return (
        <section className="relative w-full bg-card text-card-foreground py-16 md:py-24 overflow-hidden">
            <div className="mx-auto max-w-[80%] px-4 md:px-6 relative z-10">
                <Reveal>
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

                        {/* LEFT COLUMN: Content */}
                        <div className="flex flex-col space-y-8 order-2 lg:order-1">
                            <div className="space-y-4">
                                <span className="text-xl font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                                    <motion.span initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center">
                                        <Eye className="w-6 h-6" />
                                    </motion.span>
                                    {t('label')}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                                    {t('title')} <br />
                                    <span className="text-primary">{t('titleHighlight')}</span>
                                </h2>
                            </div>

                            <div className="space-y-6 text-muted text-lg leading-relaxed">
                                <p>
                                    {t('description')} <strong>{t('descriptionHighlight')}</strong>
                                </p>

                            </div>
                        </div>

                        {/* RIGHT COLUMN: Image & Decor */}
                        <div className="relative order-1 lg:order-2 pl-4 md:pl-8">
                            {/* Primary color decorative sidebar line */}
                            <div className="absolute left-0 top-10 bottom-10 w-1.5 rounded-full hidden md:block" style={{ background: 'var(--primary)' }} />
                            <div className="absolute -top-6 -right-6 z-0 opacity-10">
                            </div>

                            {/* Main Image Container */}
                            <motion.div className="relative z-10 overflow-hidden rounded-xl p-4 bg-card/50 border border-theme shadow-lg transform transition-transform hover:scale-[1.02] duration-500 ring-2 ring-primary/40 dark:ring-primary/60 dark:shadow-primary/30"
                                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
                                <div className="relative w-full h-full min-h-80 md:min-h-[420px]">
                                    <Image
                                        src="/vision.png"
                                        alt="Global Sustainable Vision"
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