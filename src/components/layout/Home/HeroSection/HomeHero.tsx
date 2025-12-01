"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const circleLayers = [
  {
    id: "narrow",
    classes: "w-[clamp(16rem,40vw,26rem)] border-primary opacity-70",
  },
  {
    id: "wide",
    classes: "w-[clamp(28rem,80vw,50rem)] border-primary/40 opacity-40",
  },
];

const HomeHero = () => {
  return (
    <section className="">
      <div className="flex justify-center items-center h-screen relative ">
        <div className="relative flex items-center justify-center p-[3%] overflow-hidden h-full ">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: [0, 1.5, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 max-w-md text-center flex flex-col gap-4 justify-center items-center "
          >
            <p className="mb-0 text-secondary-foreground">#Join the movement</p>
            <h1 className="text-[clamp(3rem,calc(3rem+2.125*(100vw-23.4375rem)/66.5625),5.125rem)] font-bold leading-none text-foreground capitalize">
              Be part of a greener future
            </h1>
            <Link href="/about" className="myBtnPrimary text-base! mt-5">
              More About EcoSphere
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1.2 }}
            className=" absolute left-1/2 top-1/2  aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary opacity-50  "
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute left-1/2 top-1/2  aspect-square w-full md:w-2/3 h-fit -translate-x-1/2 -translate-y-1/2 inset-0 border-primary border opacity-30  rounded-full"
        ></motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
