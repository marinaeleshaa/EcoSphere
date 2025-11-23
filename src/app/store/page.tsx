import StoreSlider from "@/components/layout/store/StoreSlider";
import StoreHero from "@/components/layout/store/StoreHero";
import React from "react";
import ProductCardSection from "@/components/layout/store/ProductCardSection";

export default function Store() {
  return (
    <div className="space-y-5 md:space-y-10">
      <StoreHero />
      <StoreSlider />
      <ProductCardSection />
    </div>
  );
}
