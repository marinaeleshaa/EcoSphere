import RecentlyAddedSection from "@/components/layout/news/RecentlyAddedSection";
import { useTranslations } from "next-intl";

export default function NewsPage() {
  const t = useTranslations("News.page");
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <RecentlyAddedSection />
    </div>
  );
}
