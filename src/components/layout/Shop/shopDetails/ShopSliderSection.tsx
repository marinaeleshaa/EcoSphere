"use client";

import { useRef } from "react";
import ShopCard from "../ShopCard";
import { shops } from "@/data/shops";

const ShopSliderSection = ({ currentShopId }: { currentShopId: number }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Filter out the current shop from related shops
  const relatedShops = shops.filter((shop) => shop.id !== currentShopId);

  return (
    <div className="w-full  ">
      <div
        ref={sliderRef}
        className="overflow-x-auto scroll-smooth scrollbar-hide py-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex flex-nowrap gap-5 py-5 ">
          {relatedShops.map((shop, index) => (
            <div key={shop.id} className="shrink-0 w-[260px]">
              <ShopCard shop={shop} index={index} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ShopSliderSection;
