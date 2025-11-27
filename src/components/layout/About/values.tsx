"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { Leaf, Handshake, Globe, Users} from "lucide-react";
import { motion } from "framer-motion";

export default function Values() {
    const values = [
        { 
            icon: <Leaf className="w-8 h-8 text-primary" />, 
            title: "Planet-First", 
            text: "Every action is measured by its environmental benefit and commitment to regeneration." 
        },
        { 
            icon: <Handshake className="w-8 h-8 text-primary" />, 
            title: "Integrity & Trust", 
            text: "We demand radical transparency from our partners and communicate openly with our users." 
        },
        { 
            icon: <Globe className="w-8 h-8 text-primary" />, 
            title: "Accessibility", 
            text: "We strive to make sustainable choices the easiest and most convenient option available." 
        },
        { 
            icon: <Users className="w-8 h-8 text-primary" />, 
            title: "Community", 
            text: "We prioritize connecting ethical enterprises with dedicated customers." 
        }
    ];

    return (
           <section className="relative py-20 bg-card text-card-foreground overflow-hidden">


            <div className="mx-auto max-w-[80%] px-4 relative z-10">
                <Reveal>
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xl font-bold tracking-[0.2em] text-primary uppercase mb-3 block">Our Core Values</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            Preserving The Earth For <br className="hidden md:block" /> Future Generations
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
                                    {val.title}
                                </h3>

                                <p className="text-sm text-muted leading-relaxed">
                                    {val.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}