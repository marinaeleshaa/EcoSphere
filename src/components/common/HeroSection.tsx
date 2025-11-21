"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface IProps {
  imgUrl: string;
  title: string;
  subTitle: string;
}
const HeroSection = ({ imgUrl, subTitle, title }: IProps) => {
  return (
    <section>
      <div>
        <Image
          src={imgUrl}
          width={1000}
          height={1000}
          alt="hero"
          className=" mx-auto h-[450px] relative"
        />

        {/* Overlay Box */}
        <motion.div
          className="relative left-1/2 -translate-x-1/2 -translate-y-1/3 w-[75%] backdrop-blur-2xl bg-linear-to-br from-white/10 to-transparent rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          //   viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold mb-3 text-foreground ">
            {title}
          </h1>

          <p className="mt-2 lg:text-lg text-base text-secondary-foreground/80 w-[90%] leading-relaxed">
            {subTitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
