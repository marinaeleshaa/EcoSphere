"use client";

import React from "react";
import Reveal from "@/components/ui/reveal";
import { Eye, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Vision() {
    return (
        <section className="relative w-full bg-card text-card-foreground py-16 md:py-24 overflow-hidden">
            {/* Decorative Corner Leaves (subtle and themed) */}
                        <div className="absolute top-0 left-0 w-32 md:w-48 opacity-10 -translate-x-10 -translate-y-10 rotate-180 pointer-events-none mix-blend-multiply">
                            <Image src="https://img.freepik.com/free-vector/green-leaves-branch-vector-illustration_53876-113063.jpg?w=740&t=st=1709490000~exp=1709490600~hmac=transparent" alt="" fill className="object-cover" unoptimized/>
                        </div>
                        <div className="absolute bottom-0 right-0 w-32 md:w-48 opacity-10 translate-x-10 translate-y-10 pointer-events-none mix-blend-multiply">
                            <Image src="https://img.freepik.com/free-vector/green-leaves-branch-vector-illustration_53876-113063.jpg?w=740&t=st=1709490000~exp=1709490600~hmac=transparent" alt="" fill className="object-cover" unoptimized/>
                        </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <Reveal>
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                        
                        {/* LEFT COLUMN: Content */}
                        <div className="flex flex-col space-y-8 order-2 lg:order-1">
                            <div className="space-y-4">
                                <span className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                                  <motion.span initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center">
                                    <Eye className="w-4 h-4" />
                                  </motion.span>
                                  Our Vision
                                </span>
                                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                                    A world where <br />
                                    <span className="text-green-600">sustainable is standard.</span>
                                </h2>
                            </div>

                            <div className="space-y-6 text-muted text-lg leading-relaxed">
                                <p>
                                    Our vision is to help create an interconnected, global economy 
                                    where sustainable and regenerative commerce is the <strong className="text-gray-900">standard, not the exception.</strong>
                                </p>
                                <p>
                                    We envision a world where consumers implicitly trust that their 
                                    purchases are actively supporting the health of the planet and 
                                    the well-being of workers across the entire supply chain. By 
                                    elevating ethical enterprises, we aim to inspire market-wide 
                                    transformation, driving businesses toward greater environmental 
                                    responsibility and resource circularity.
                                </p>
                                <p className="font-semibold text-foreground">
                                    This vision is ambitious, but achievable — and we invite you to be a part of it.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Image & Decor */}
                                    <div className="relative order-1 lg:order-2 pl-4 md:pl-8">
                            {/* Primary color decorative sidebar line */}
                            <div className="absolute left-0 top-10 bottom-10 w-1.5 rounded-full hidden md:block" style={{ background: 'var(--primary)' }} />

                            {/* Decorative circular lines overlay */}
                            <div className="absolute -top-6 -right-6 z-0 opacity-10">
                                <div className="w-32 h-32 rounded-full border-4 border-dashed animate-spin-slow" style={{ borderColor: 'var(--primary)' }} />
                            </div>

                            {/* Main Image Container */}
                                                        <motion.div className="relative z-10 overflow-hidden rounded-xl shadow-2xl transform transition-transform hover:scale-[1.01] duration-500 bg-card"
                              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
                                                            <div className="relative w-full md:min-h-[400px] h-72">
                                                                <Image
                                                                    src="/vision.jpeg"
                                                                    alt="Global Sustainable Vision"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                
                                {/* Overlay Card with icon */}
                                                                <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-theme flex items-center justify-between">
                                   <div>
                                                                         <p className="text-sm font-bold text-foreground">Future Forward</p>
                                                                         <p className="text-xs text-primary">Driving global change</p>
                                   </div>
                                   <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                     <Lightbulb className="w-5 h-5" />
                                   </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </Reveal>
            </div>
        </section>
    );
}