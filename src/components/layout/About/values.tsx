"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { Leaf, Handshake, Globe, Users, Recycle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Values() {
    const values = [
        { 
            icon: <Leaf className="w-8 h-8 text-green-600" />, 
            title: "Planet-First", 
            text: "Every action is measured by its environmental benefit and commitment to regeneration." 
        },
        { 
            icon: <Handshake className="w-8 h-8 text-green-600" />, 
            title: "Integrity & Trust", 
            text: "We demand radical transparency from our partners and communicate openly with our users." 
        },
        { 
            icon: <Globe className="w-8 h-8 text-green-600" />, 
            title: "Accessibility", 
            text: "We strive to make sustainable choices the easiest and most convenient option available." 
        },
        { 
            icon: <Users className="w-8 h-8 text-green-600" />, 
            title: "Community", 
            text: "We prioritize connecting ethical enterprises with dedicated customers." 
        }
    ];

    return (
           <section className="relative py-20 bg-card text-card-foreground overflow-hidden">
            {/* Decorative Corner Leaves - using placeholder images to match the vibe */}
                        <div className="absolute top-0 left-0 w-32 md:w-48 opacity-20 -translate-x-10 -translate-y-10 rotate-180 pointer-events-none mix-blend-multiply">
                            <Image src="https://img.freepik.com/free-vector/green-leaves-branch-vector-illustration_53876-113063.jpg?w=740&t=st=1709490000~exp=1709490600~hmac=transparent" alt="" fill className="object-cover" unoptimized/>
                        </div>
                        <div className="absolute top-0 right-0 w-32 md:w-48 opacity-20 translate-x-10 -translate-y-10 pointer-events-none mix-blend-multiply">
                            <Image src="https://img.freepik.com/free-vector/green-leaves-branch-vector-illustration_53876-113063.jpg?w=740&t=st=1709490000~exp=1709490600~hmac=transparent" alt="" fill className="object-cover" unoptimized/>
                        </div>

            <div className="container mx-auto px-4 relative z-10">
                <Reveal>
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3 block">Our Core Values</span>
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
                                className="bg-card rounded-2xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group border border-transparent hover:border-theme"
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

                    {/* Bottom Image Section */}
                    <div className="flex justify-center mt-12">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg max-w-sm w-full h-48 group">
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop"
                                                                alt="Recycling process"
                                                                fill
                                                                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                                unoptimized
                                                            />
                                                        </div>
                            {/* Overlay icon similar to design */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <Recycle className="w-12 h-12 text-white drop-shadow-lg" />
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}