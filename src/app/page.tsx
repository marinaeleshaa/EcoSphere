import HomeHeroLayout from "@/components/layout/Home/HeroSection/HomeHeroLayout";
import MarketplaceLayout from "@/components/layout/Home/MarketplaceSection/MarketplaceLayout";
import PartnerLayout from "@/components/layout/Home/PartnersSection/PartnerLayout";

export default function Home() {
  return (
    <main>
      <HomeHeroLayout />
      <MarketplaceLayout />
      <PartnerLayout />
    </main>
  );
}
