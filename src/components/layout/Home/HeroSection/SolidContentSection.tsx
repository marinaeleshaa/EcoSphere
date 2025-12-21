import React from "react";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";
import { BsPatchCheckFill } from "react-icons/bs";
import { HiLightBulb } from "react-icons/hi2";
import { FaPeopleGroup } from "react-icons/fa6";
import { useTranslations } from "next-intl";

const SolidContentSection = () => {
  const t = useTranslations("Home.solidContent");
  const data = [
    {
      text: t("footprint"),
      icon: <BsPatchCheckFill size={48} />,
    },
    {
      text: t("tips"),
      icon: <HiLightBulb size={48} />,
    },
    {
      text: t("community"),
      icon: <FaPeopleGroup size={48} />,
    },
  ];

  return (
    <div className="bg-primary w-full py-5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <BasicAnimatedWrapper
              key={index}
              index={index}
              className="text-primary-foreground"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="text-base leading-relaxed">{item.text}</p>
              </div>
            </BasicAnimatedWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolidContentSection;
