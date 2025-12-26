"use client";

import { useState } from "react";
import { Star, Clock, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { IShop } from "@/types/ShopTypes";
import Image from "next/image";
import dynamic from "next/dynamic";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";

const BranchMap = dynamic(() => import("./ShopMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-100 rounded-lg overflow-hidden shadow-lg border border-border flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

interface ShopDetailsCardProps {
  shop: IShop;
  liveAverageRating: number;
}

const ShopDetailsCard = ({ shop, liveAverageRating }: ShopDetailsCardProps) => {
  const t = useTranslations("ShopDetails.card");
  const [showMap, setShowMap] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <section>
      <BasicAnimatedWrapper className="flex flex-col gap-10 mt-30 w-full">
        <div className="flex flex-col justify-center items-center md:flex-row gap-10 w-full">
          <div className="relative shadow-lg rounded-lg  ">
            <Image
              width={600}
              height={400}
              src={shop.avatar?.url || "/shop-img.jpg"}
              alt={shop.name}
              className="w-125 rounded-lg "
            />
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

            <div className="max-w-[50%] max-h-[30%] absolute -bottom-[3%] -left-[5%] rounded-full bg-background p-4 drop-shadow-lg ">
              <div className="bg-primary rounded-full px-4 py-2 w-full text-center flex items-center  gap-4">
                <Image
                  src="/store img/avatar.jpg"
                  alt="shop icon"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-lg font-bold text-primary-foreground">
                    {shop.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {shop.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(liveAverageRating)
                        ? "fill-primary text-primary"
                        : "fill-none text-primary"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({liveAverageRating.toFixed(1)})
              </span>
            </div>

            <div className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                {t("workingHours")}
              </span>
              <span className="text-muted-foreground">{shop.workingHours}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("about")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {shop.description}
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setShowMap(!showMap);
                  setShowContact(false);
                }}
                className="flex-1 bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 cursor-pointer"
              >
                <MapPin className="w-5 h-5" />
                {t("visitShop")}
              </button>
              <button
                onClick={() => {
                  setShowContact(!showContact);
                  setShowMap(false);
                }}
                className="flex-1 bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 cursor-pointer"
                aria-label="Contact shop"
              >
                <Phone className="w-5 h-5" />
                {t("contact")}
              </button>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
            showContact ? "max-h-75 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {showContact && (
            <div className="w-full p-6 bg-muted/50 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-25">
                    Phone:
                  </span>
                  <a
                    href={`tel:${shop.phoneNumber}`}
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    {shop.phoneNumber}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
            showMap ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {showMap && (
            <BranchMap shopName={shop.name} location={shop.location} />
          )}
        </div>
      </BasicAnimatedWrapper>
    </section>
  );
};

export default ShopDetailsCard;
