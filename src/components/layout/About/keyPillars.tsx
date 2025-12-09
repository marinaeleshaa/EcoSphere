"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { Sprout, HeartHandshake, Search, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function KeyPillars() {
    const t = useTranslations('About.keyPillars');

    const pillars = [
        {
            icon: <Sprout className="w-8 h-8 text-primary" />,
            key: "environmental"
        },
        {
            icon: <HeartHandshake className="w-8 h-8 text-primary" />,
            key: "ethical"
        },
        {
            icon: <Search className="w-8 h-8 text-primary" />,
            key: "transparency"
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            key: "quality"
        }
    ];

    return (
        <section className="relative py-20 bg-card text-card-foreground overflow-hidden">
            {/* Decorative Corner Leaves (Rotated for variety compared to Values component) */}
            <div className="absolute top-0 right-0 w-48 opacity-10 translate-x-12 -translate-y-8 rotate-90 pointer-events-none mix-blend-multiply">
                <Image src="https://img.freepik.com/free-vector/green-leaves-branch-vector-illustration_53876-113063.jpg?w=740&t=st=1709490000~exp=1709490600~hmac=transparent" alt="" fill className="object-cover" unoptimized />
            </div>
            <div className="absolute bottom-0 left-0 w-64 opacity-10 -translate-x-20 translate-y-20 -rotate-45 pointer-events-none mix-blend-multiply">
                <Image src="https://img.freepik.com/free-vector/green-leaves-branch-vector-illustration_53876-113063.jpg?w=740&t=st=1709490000~exp=1709490600~hmac=transparent" alt="" fill className="object-cover" unoptimized />
            </div>

            <div className="mx-auto max-w-[80%] px-4 relative z-10">
                <Reveal>
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xl font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
                            {t('label')}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            {t('title')}
                        </h2>
                        <p className="mt-4 text-muted max-w-2xl mx-auto">
                            {t('description')}
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pillars.map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.16 }}
                                transition={{ duration: 0.6, delay: i * 0.06 }}
                                whileHover={{ translateY: -4 }}
                                className="bg-card rounded-2xl p-8 text-center shadow-lg duration-300 group border border-transparent hover:border-theme transform hover:scale-[1.02] ring-2 ring-primary/30 dark:ring-primary/60 dark:shadow-primary/30 flex flex-col items-center"
                            >
                                {/* Icon Circle */}
                                <motion.div whileTap={{ scale: 0.98 }} className="w-20 h-20 bg-[var(--primary-foreground)/0.08] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {pillar.icon}
                                </motion.div>

                                <h3 className="font-bold text-xl text-foreground mb-3">
                                    {t(`pillars.${pillar.key}.title`)}
                                </h3>

                                <p className="text-sm text-muted leading-relaxed">
                                    {t(`pillars.${pillar.key}.text`)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}