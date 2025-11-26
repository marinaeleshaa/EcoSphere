import StoreSlider from "@/components/layout/Store/StoreSlider";
import ProductCardSection from "@/components/layout/Store/ProductCardSection";
import HeroSection from "@/components/layout/common/HeroSection";

export default function Store() {
  return (
    <div className="space-y-5 md:space-y-10">
      <HeroSection
        imgUrl="/m.png"
        title="Our Store"
        subTitle="EcoSphere is your trusted destination for eco-friendly products, sustainable gifts, and smart green choices. Browse a variety of earth-conscious items made to help you live cleaner, better, and more naturally every day."
      />
      <StoreSlider />
      <ProductCardSection />
    </div>
  );
}
