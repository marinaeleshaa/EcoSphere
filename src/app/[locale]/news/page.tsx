"use client";

import RecentlyAddedSection from "@/components/news/RecentlyAddedSection";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            News & Updates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the latest additions to EcoSphere. Discover new eco-friendly restaurants and shops joining our community.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <RecentlyAddedSection />
    </div>
  );
}
