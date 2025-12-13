import StoreSlider from "@/components/layout/Store/StoreSlider";
import HeroSection from "@/components/layout/common/HeroSection";
import { useTranslations } from 'next-intl';
import { getProducts } from "@/frontend/api/Store";
import ProductCardSection from "@/components/layout/Store/ProductCardSection";

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
      <ProductCardSection products={products} />
    </div>
  );
}
