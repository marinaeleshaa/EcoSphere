"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { Leaf, Handshake, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export default function Values() {
    const t = useTranslations('About.values');

    const values = [
        {
            icon: <Leaf className="w-8 h-8 text-primary" />,
            titleKey: "planetFirst"
        },
        {
            icon: <Handshake className="w-8 h-8 text-primary" />,
            titleKey: "integrity"
        },
        {
            icon: <Globe className="w-8 h-8 text-primary" />,
            titleKey: "accessibility"
        },
        {
            icon: <Users className="w-8 h-8 text-primary" />,
            titleKey: "community"
        }
    ];

    return (
        <section className="relative py-20 bg-card text-card-foreground overflow-hidden">


            <div className="mx-auto max-w-[80%] px-4 relative z-10">
                <Reveal>
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xl font-bold tracking-[0.2em] text-primary uppercase mb-3 block">{t('label')}</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            {t('title')}
                        </h2>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {values.map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.18 }}
                                transition={{ duration: 0.6, delay: i * 0.08 }}
                                whileHover={{ translateY: -4 }}
                                className="bg-card rounded-2xl p-8 text-center shadow-lg duration-300 group border border-transparent hover:border-theme transform hover:scale-[1.02] ring-2 ring-primary/30 dark:ring-primary/60 dark:shadow-primary/30"
                            >
                                {/* Icon Circle */}
                                <motion.div whileTap={{ scale: 0.98 }} className="mx-auto w-20 h-20 bg-[var(--primary-foreground)/0.08] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {val.icon}
                                </motion.div>

                                <h3 className="font-bold text-xl text-foreground mb-4">
                                    {t(`cards.${val.titleKey}.title`)}
                                </h3>

                                <p className="text-sm text-muted leading-relaxed">
                                    {t(`cards.${val.titleKey}.text`)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}