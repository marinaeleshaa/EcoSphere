import React from "react";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";
import Image from "next/image";

const PartnerRight = () => {
  return (
    <BasicAnimatedWrapper delay={0.7} className="w-full md:w-1/2 relative">
      <div className="absolute inset-0 w-[90%] h-[80%] mx-auto bg-primary rounded-lg">
      </div>
      <Image
        src="/home/partner.png"
        width={500}
        height={500}
        alt="marketplace"
        className="w-full    object-cover -translate-y-1/12"
      />
    </BasicAnimatedWrapper>
  );
};

export default PartnerRight;
