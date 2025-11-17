"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const StoreHero = () => {
  return (
    <section>
      <div>
        <Image
          src="/1.jpg"
          width={1000}
          height={1000}
          alt="hero"
          className="w-screen h-[450px] relative"
        />

        {/* Overlay Box */}
        <motion.div
          className="relative left-1/2 -translate-x-1/2 -translate-y-1/3 w-[75%] backdrop-blur-2xl bg-linear-to-br from-[#527b50]/10 to-transparent rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
        //   viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold mb-3 ">
            Our Store
          </h1>

          <p className="mt-2 lg:text-lg text-base text-stone-700 w-[90%] leading-relaxed">
            EcoSphere is your trusted destination for eco-friendly products,
            sustainable gifts, and smart green choices. Browse a variety of
            earth-conscious items made to help you live cleaner, better, and
            more naturally every day.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default StoreHero;
