"use client";

import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { IShop } from "@/types/ShopTypes";
import { getAverageRating } from "../ShopSection";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";

const ShopDetailsCard = ({ shop }: { shop: IShop }) => {
  const t = useTranslations("ShopDetails.card");

  return (
    <section className="">
      <BasicAnimatedWrapper className="flex flex-col justify-center items-center md:flex-row gap-10 my-30 ">
        {/* shop image */}
        <div className="relative shadow-lg rounded-lg  ">
          <Image
            width={600}
            height={400}
            src={
              typeof shop.avatar === "string" ? shop.avatar : "/shop-img.jpg"
            }
            alt={shop.name}
            className="w-[500px] rounded-lg "
          />
          {/* top right decorative SVG */}
          <div className="w-[30%] h-[30%] absolute -top-[6%] -right-[6%]  ">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1 1"
              xmlns="http://www.w3.org/2000/svg"
              className="text-background drop-shadow-lg "
            >
              <path
                d="M0 0H0.479167C0.766667 0 1 0.233333 1 0.520833V1H0.520833C0.233333 1 0 0.766667 0 0.479167V0Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="w-[20%] h-[20%] absolute top-0 right-0 ">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1 1"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary "
            >
              <path
                d="M0 0H0.479167C0.766667 0 1 0.233333 1 0.520833V1H0.520833C0.233333 1 0 0.766667 0 0.479167V0Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* bottom left decorative SVG */}
          <div className="max-w-[50%] max-h-[30%] absolute -bottom-[3%] -left-[5%] rounded-full bg-background p-4 drop-shadow-lg ">
            {/* shop data */}
            <div className="bg-primary rounded-full px-4 py-2 w-full text-center flex items-center  gap-4">
              <Image
                src="/store img/avatar.jpg"
                alt="shop icon"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {shop.name}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* shop details */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Shop name and cuisine */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {shop.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(+getAverageRating(shop))
                      ? "fill-primary text-primary"
                      : "fill-none text-primary"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({getAverageRating(shop).toFixed(1)})
            </span>
          </div>

          {/* Working Hours */}
          <div className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">
              {t("workingHours")}
            </span>
            <span className="text-muted-foreground">{shop.workingHours}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("about")}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {shop.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            <button className="flex-1 bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 cursor-pointer">
              {t("visitShop")}
            </button>
            <button
              className="flex-1 bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 cursor-pointer"
              aria-label="Contact shop"
            >
              {t("contact")}
            </button>
          </div>
        </div>
      </BasicAnimatedWrapper>
    </section>
  );
};

export default ShopDetailsCard;
