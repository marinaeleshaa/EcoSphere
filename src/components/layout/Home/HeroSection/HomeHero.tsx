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

import { useTranslations } from "next-intl";

const HomeHero = () => {
  const t = useTranslations("Home");
  return (
    <section  className=" hero-ltr ">
      <div className="flex justify-center items-center min-h-screen relative ">
        <div className="relative flex items-center justify-center p-[3%] overflow-hidden w-full h-full min-h-screen py-20 md:py-0">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: [0, 1.5, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 max-w-md text-center flex flex-col gap-4 justify-center items-center "
          >
            <p className="mb-0 text-secondary-foreground">
              {t("hero.subtitle")}
            </p>
            <h1 className="text-[clamp(3rem,calc(3rem+2.125*(100vw-23.4375rem)/66.5625),5.125rem)] font-bold leading-none text-foreground">
              {t("hero.title")}
            </h1>
            <Link href="/about" className="myBtnPrimary text-base! mt-5">
              {t("hero.cta")}
            </Link>
          </motion.div>
          {/* big circle - centered within container, not viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="absolute inset-0 hidden sm:block m-auto aspect-square w-8/12 h-fit rounded-full border border-primary opacity-50"
          />
        </div>
        {/* small circle - centered within container, not viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="absolute inset-0  m-auto aspect-square w-full md:w-5/12 lg:w-4/12 h-fit rounded-full border-primary border opacity-30"
        ></motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
