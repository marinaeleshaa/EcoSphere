import HeroSection from "@/components/layout/common/HeroSection";
import RecentlyAddedSection from "@/components/layout/news/RecentlyAddedSection";
import { useTranslations } from "next-intl";

export default function NewsPage() {
  const t = useTranslations("News.page");
  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        imgUrl="/unnamed.jpg"
        title={t("title")}
        subTitle={t("description")}
      />

      {/* Content Section */}
      <RecentlyAddedSection />
    </div>
  );
}
