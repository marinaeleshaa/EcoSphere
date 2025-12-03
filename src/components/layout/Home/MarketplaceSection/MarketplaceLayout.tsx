import React from "react";
import MarketLeft from "./MarketLeft";
import MarketRight from "./MarketRight";

const MarketplaceLayout = () => {
  return (
    <div className="mt-40 bg-primary/5 py-10 ">
      <div className="md:w-[70%] w-[90%] mx-auto">
        <div className="flex flex-col justify-center items-center md:flex-row gap-10">
          <MarketLeft />
          <MarketRight/>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceLayout;
