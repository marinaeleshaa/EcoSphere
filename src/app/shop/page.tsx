"use client";

import HeroSection from "@/components/layout/common/HeroSection";
import ShopHero from "@/components/layout/Shop/ShopHero";
import ShopSection from "@/components/layout/Shop/ShopSection";
import { useTranslations } from 'next-intl';

export default function Shop() {
  const t = useTranslations('Shop.hero');

  return (
    <>
      <HeroSection
        title={t('title')}
        subTitle={t('subtitle')}
        imgUrl="/s.png"
      />
      <ShopHero />
      <ShopSection />
    </>
  );
}
