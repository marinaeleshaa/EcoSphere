import React from "react";
import PartnerRight from "./PartnerRight";
import PartnerLeft from "./PartnerLeft";

const PartnerLayout = () => {
  return (
    <div className="mt-20 py-10 ">
      <div className="md:w-[70%] w-[90%] mx-auto">
        <div className="flex flex-col justify-center  md:flex-row gap-10">
          <PartnerLeft />
          <PartnerRight />
        </div>
      </div>
    </div>
  );
};

export default PartnerLayout;
