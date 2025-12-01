"use client";

import HeroSection from "@/components/layout/common/HeroSection";
import ShopHero from "@/components/layout/Shop/ShopHero";
import ShopSection from "@/components/layout/Shop/ShopSection";

export default function Shop() {
  return (
    <>
      <HeroSection
        title="Shops"
        subTitle="Shops for eco-friendly products and gifts made with love for our planet."
        imgUrl="/s.png"
      />
      <ShopHero />
      <ShopSection />
    </>
  );
}
