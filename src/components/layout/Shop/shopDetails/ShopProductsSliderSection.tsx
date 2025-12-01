"use client";

import { useRef } from "react";
import ProductCard from "../../Store/ProductCard";
import { products } from "@/data/products";

const ShopProductsSliderSection = ({ shopName }: { shopName?: string }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Filter products by shopName
  const shopProducts = shopName 
    ? products.filter((product) => product.shopName === shopName)
    : [];

  if (shopProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No products available for this shop.</p>
      </div>
    );
  }

  return (
    <div className="w-full  ">
      <div
        ref={sliderRef}
        className="overflow-x-auto scroll-smooth scrollbar-hide py-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex flex-nowrap gap-5 py-5 ">
          {shopProducts.map((product) => (
            <div key={product.id} className="shrink-0 w-[260px]">
              <ProductCard {...product} />
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

export default ShopProductsSliderSection;
