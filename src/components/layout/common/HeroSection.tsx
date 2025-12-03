import Image from "next/image";
import { motion } from "framer-motion";
import BasicAnimatedWrapper from "./BasicAnimatedWrapper";

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
          className="  object-cover mx-auto h-[450px] relative z-0"
        />

        {/* Overlay Box */}
        <BasicAnimatedWrapper className="relative z-10 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[80%] bg-primary/70  dark:bg-primary/50 backdrop-blur-lg to-transparent rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
          <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold mb-3 text-primary-foreground ">
            {title}
          </h1>

          <p className="mt-2 lg:text-lg text-base text-primary-foreground/80 w-[90%] leading-relaxed">
            {subTitle}
          </p>
        </BasicAnimatedWrapper>
      </div>
    </section>
  );
};

export default HeroSection;
