import StoreSlider from "@/components/layout/Store/StoreSlider";
import HeroSection from "@/components/layout/common/HeroSection";
import { useTranslations } from 'next-intl';
import { ProductCardSectionClient } from "@/components/layout/Store/ProductCardSectionClient";
import { getProducts } from "@/frontend/api/Store";

export default function Store() {
  const t = useTranslations('Store.hero');

  const products = getProducts().then((res) => res.data);

  return (
    <div className="space-y-5 md:space-y-10">
      <HeroSection
        imgUrl="/final.png"
        title={t('title')}
        subTitle={t('subtitle')}
      />
      <StoreSlider />
      <ProductCardSectionClient products={products} />
    </div>
  );
}
