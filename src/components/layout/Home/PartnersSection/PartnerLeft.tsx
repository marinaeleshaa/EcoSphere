import React from "react";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";
import Link from "next/link";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useTranslations } from "next-intl";

const PartnerLeft = () => {
  const t = useTranslations("Home.partners");
  return (
    <BasicAnimatedWrapper className="w-full md:w-1/2">
      <div className="space-y-5">
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
          {t("title")}
        </p>
        <p className="">{t("description")}</p>

        <Link
          href="/shop"
          className=" text-primary-foreground bg-primary p-3 px-4 rounded-full flex justify-center items-center w-fit gap-2 transition duration-400 hover:scale-102 group"
        >
          {t("cta")}
          <p className="group-hover:translate-x-1 transition duration-300">
            <IoIosArrowDroprightCircle />
          </p>
        </Link>
        <div className="flex flex-col text-center md:flex-row justify-evenly items-center">
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
              {t("stats.partners")}
            </p>
            <p className="text-secondary-foreground">
              {t("stats.partnersDesc")}
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
              {t("stats.products")}
            </p>
            <p className="text-secondary-foreground">
              {t("stats.productsDesc")}
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
              {t("stats.farms")}
            </p>
            <p className="text-secondary-foreground">{t("stats.farmsDesc")}</p>
          </div>
        </div>
      </div>
    </BasicAnimatedWrapper>
  );
};

export default PartnerLeft;
