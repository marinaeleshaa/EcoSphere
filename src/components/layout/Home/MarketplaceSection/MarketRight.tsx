import React from "react";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";
import Link from "next/link";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const MarketRight = () => {
  return (
    <BasicAnimatedWrapper delay={0.7} className="w-full md:w-1/2">
      <div className="space-y-5">
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
          Our Store
        </p>
        <p className="">
          Shop 100% eco-friendly products and start your journey toward a more
          sustainable lifestyle. We offer a wide range of certified, toxin-free
          items carefully selected from trusted eco-friendly stores and partner
          farms across Egypt and beyond.
        </p>
        <ul className="list-disc text-secondary-foreground p-4">
          <li>
            Products made from natural, biodegradable, and recycled materials.
          </li>
          <li>
            A full range of zero-waste essentials you can rely on every day.
          </li>
          <li>
            Fresh and organic farm products sourced responsibly from local
            eco-farms.
          </li>
        
        </ul>
        <Link
          href="/store"
          className=" text-primary-foreground bg-primary p-3 px-4 rounded-full flex justify-center items-center w-fit gap-2 transition duration-400 hover:scale-102 group"
        >
          Visit Store
          <p className="group-hover:translate-x-1 transition duration-300">
            <IoIosArrowDroprightCircle />
          </p>
        </Link>
      </div>
    </BasicAnimatedWrapper>
  );
};

export default MarketRight;
