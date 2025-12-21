import HeroSection from "@/components/layout/common/HeroSection";
import Story from "@/components/layout/About/story";
import Values from "@/components/layout/About/values";
import Mission from "@/components/layout/About/mission";
import Vision from "@/components/layout/About/vision";
import Verification from "@/components/layout/About/verification";
import KeyPillars from "@/components/layout/About/keyPillars";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("About.hero");

  return (
    <div className="scroll-smooth">
      <HeroSection
        imgUrl="/hero.png"
        title={t("title")}
        subTitle={t("subtitle")}
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
