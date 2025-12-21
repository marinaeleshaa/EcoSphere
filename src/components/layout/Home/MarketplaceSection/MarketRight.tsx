import React from "react";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";
import Link from "next/link";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useTranslations } from "next-intl";

const MarketRight = () => {
  const t = useTranslations("Home.marketplace");
  return (
    <BasicAnimatedWrapper delay={0.7} className="w-full md:w-1/2">
      <div className="space-y-5">
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary ">
          {t("title")}
        </p>
        <p className="">{t("description")}</p>
        <ul className="list-disc text-secondary-foreground p-4">
          <li>{t("list.natural")}</li>
          <li>{t("list.zeroWaste")}</li>
          <li>{t("list.farm")}</li>
        </ul>
        <Link
          href="/store"
          className=" text-primary-foreground bg-primary p-3 px-4 rounded-full flex justify-center items-center w-fit gap-2 transition duration-400 hover:scale-102 group"
        >
          {t("cta")}
          <p className="group-hover:translate-x-1 transition duration-300">
            <IoIosArrowDroprightCircle />
          </p>
        </Link>
      </div>
    </BasicAnimatedWrapper>
  );
};

export default MarketRight;
