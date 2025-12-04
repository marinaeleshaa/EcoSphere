"use client";

import HeroSection from "@/components/layout/common/HeroSection";
import Story from "@/components/layout/About/story";
import Values from "@/components/layout/About/values";
import Mission from "@/components/layout/About/mission";
import Vision from "@/components/layout/About/vision";
import Verification from "@/components/layout/About/verification";
import KeyPillars from "@/components/layout/About/keyPillars";
import { useTranslations } from 'next-intl';


export default function AboutPage() {
  const t = useTranslations('About');
  return (
    <div className="scroll-smooth">
      <HeroSection imgUrl="/m.png"
        title={t('hero.title')}
        subTitle={t('hero.subtitle')}
      />
      <Story />
      <Values />
      <Mission />
      <Vision />
      <Verification />
      <KeyPillars />
    </div>
  );
}