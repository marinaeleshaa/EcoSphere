import React from "react";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";
import Link from "next/link";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const PartnerLeft = () => {
  return (
    <BasicAnimatedWrapper className="w-full md:w-1/2">
      <div className="space-y-5">
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
          Eco-Friendly Partner Stores & Farms
        </p>
        <p className="">
          We proudly connect you with top eco-friendly stores and farms that
          share our mission of promoting a cleaner, more sustainable future. Our
          network is growing every day, making it easier for you to access
          trusted, safe, and environmentally responsible products from certified
          shops and passionate eco farms.
        </p>

        <Link
          href="/shop"
          className=" text-primary-foreground bg-primary p-3 px-4 rounded-full flex justify-center items-center w-fit gap-2 transition duration-400 hover:scale-102 group"
        >
          Visit Our Partners
          <p className="group-hover:translate-x-1 transition duration-300">
            <IoIosArrowDroprightCircle />
          </p>
        </Link>
        <div className="flex flex-col text-center md:flex-row justify-evenly items-center">
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
              50+
            </p>
            <p className="text-secondary-foreground">
              partners committed to sustainability
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
              1200+
            </p>
            <p className="text-secondary-foreground">
              natural and toxin-free products
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
              15+
            </p>
            <p className="text-secondary-foreground">certified local farms</p>
          </div>
        </div>
      </div>
    </BasicAnimatedWrapper>
  );
};

export default PartnerLeft;
