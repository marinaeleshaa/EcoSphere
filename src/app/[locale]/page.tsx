import Values from "@/components/layout/About/values";
import Verification from "@/components/layout/About/verification";
import HomeHeroLayout from "@/components/layout/Home/HeroSection/HomeHeroLayout";
import MarketplaceLayout from "@/components/layout/Home/MarketplaceSection/MarketplaceLayout";
import PartnerLayout from "@/components/layout/Home/PartnersSection/PartnerLayout";
import StoreSlider from "@/components/layout/Store/StoreSlider";

export default function Home() {
  return (
    <main>
      <HomeHeroLayout />
      <MarketplaceLayout />
      <PartnerLayout />
      <StoreSlider/>
      <Verification/>
      <Values/>
    </main>
  );
}
