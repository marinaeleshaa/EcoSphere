"use client";

import React from "react";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";



export default function About() {
  return (
    <section className="relative w-full bg-card text-card-foreground py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-[80%] px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Images & Decorative Elements */}
          <div className="relative">
            {/* Primary color decorative sidebar line */}
            <div className="absolute -left-4 top-10 bottom-10 w-1.5 rounded-full hidden md:block" style={{ background: 'var(--primary)' }} />
            
            <div className="relative pl-4 md:pl-8">
              {/* Main Image (Hands holding plant) */}
              <div className="relative z-10 overflow-hidden rounded-xl shadow-xl">
                <div className="relative w-full h-[400px] md:h-[500px]">
                  <Image
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
                    alt="Hands holding soil and plant"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Overlay Card (Illustration) */}
              <div className="absolute -bottom-6 -right-4 z-20 md:-bottom-10 md:-right-10 w-48 md:w-64 bg-card p-3 rounded-xl shadow-2xl border border-theme">
                <div className="relative w-full h-32 md:h-40">
                  <Image
                    src="https://img.freepik.com/free-vector/people-planting-tree-together_23-2148667607.jpg"
                    alt="Community planting illustration"
                    fill
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
              </div>
              
              {/* Decorative circular lines overlay */}
              <div className="absolute top-10 left-10 z-20 opacity-30 pointer-events-none rounded-full w-32 h-32" style={{ borderColor: 'var(--foreground)', borderWidth: '1px' }} />
              <div className="absolute top-14 left-14 z-20 opacity-30 pointer-events-none rounded-full w-24 h-24" style={{ borderColor: 'var(--foreground)', borderWidth: '1px' }} />
            </div>
          </div>

          {/* RIGHT COLUMN: Content */}
          <div className="flex flex-col space-y-6 lg:pl-8">
              <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">About Us</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                <motion.span initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="inline-block mr-3">
                  <Globe size={28} />
                </motion.span>
                Building a greener <br />
                future together Forever
              </h2>
            </div>

            {/* Replaced text with your summary */}
            <p className="text-muted leading-relaxed">
              EcoSphere was founded to eliminate the confusion of greenwashing. 
              We bridge the gap between conscious consumers and planet-friendly 
              businesses by offering a platform that rigorously vets and simplifies 
              ethical shopping.
            </p>
            {/* Footer: Profile & CTA */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-theme mt-4">
              <div className="flex items-center gap-3">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}