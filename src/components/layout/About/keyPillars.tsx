"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { Sprout, HeartHandshake, Search, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function KeyPillars() {
    const pillars = [
        { 
            icon: <Sprout className="w-8 h-8 text-green-600" />,
            title: "Environmental Impact", 
            text: "Sourcing organic, recycled materials with a focus on carbon neutrality and minimal waste." 
        },
        { 
            icon: <HeartHandshake className="w-8 h-8 text-green-600" />,
            title: "Ethical Labor", 
            text: "Ensuring fair wages, safe working conditions, and absolutely no forced or child labor." 
        },
        { 
            icon: <Search className="w-8 h-8 text-green-600" />,
            title: "Supply Chain Transparency", 
            text: "Providing verifiable proof and complete openness about sourcing, processing, and logistics." 
        },
        { 
            icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
            title: "Durability & Quality", 
            text: "Products designed for longevity, repairability, and circularity — actively fighting waste culture." 
        }
    ];

    return (
        <section className="relative py-20 bg-card text-card-foreground overflow-hidden">
            {/* Decorative Corner Leaves (Rotated for variety compared to Values component) */}
                        <div className="absolute top-0 right-0 w-48 opacity-10 translate-x-12 -translate-y-8 rotate-90 pointer-events-none mix-blend-multiply">
                            <Image src="https://img.freepik.com/free-vector/green-leaves-branch-vector-illustration_53876-113063.jpg?w=740&t=st=1709490000~exp=1709490600~hmac=transparent" alt="" fill className="object-cover" unoptimized/>
                        </div>
                        <div className="absolute bottom-0 left-0 w-64 opacity-10 -translate-x-20 translate-y-20 -rotate-45 pointer-events-none mix-blend-multiply">
                            <Image src="https://img.freepik.com/free-vector/green-leaves-branch-vector-illustration_53876-113063.jpg?w=740&t=st=1709490000~exp=1709490600~hmac=transparent" alt="" fill className="object-cover" unoptimized/>
                        </div>

            <div className="container mx-auto px-4 relative z-10">
                <Reveal>
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
                            Our Standards
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            Key Vetting Pillars
                        </h2>
                        <p className="mt-4 text-muted max-w-2xl mx-auto">
                            We don&apos;t just take a brand&apos;s word for it. We rigorously evaluate every partner against these four non-negotiable standards.
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
                                className="bg-card rounded-2xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group border border-transparent hover:border-theme flex flex-col items-center"
                            >
                                {/* Icon Circle */}
                                <motion.div whileTap={{ scale: 0.98 }} className="w-20 h-20 bg-[var(--primary-foreground)/0.08] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {pillar.icon}
                                </motion.div>
                                
                                <h3 className="font-bold text-xl text-foreground mb-3">
                                    {pillar.title}
                                </h3>
                                
                                <p className="text-sm text-muted leading-relaxed">
                                    {pillar.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}