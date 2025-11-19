import StoreSlider from "@/components/layout/Store/StoreSlider";
import StoreHero from "@/components/layout/Store/StoreHero";
import React from "react";
import ProductCardSection from "@/components/layout/Store/ProductCardSection";

export default function Store() {
  return (
    <div className="space-y-5 md:space-y-10">
      <StoreHero />
      <StoreSlider />
      <ProductCardSection />
    </div>
  );
}
