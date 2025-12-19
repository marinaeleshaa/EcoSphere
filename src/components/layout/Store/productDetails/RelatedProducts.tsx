import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";
import ProductSliderSection from "./ProductSliderSection";
import { useTranslations } from "next-intl";

import { IProduct } from "@/types/ProductType";

const RelatedProducts = ({ products }: { products: IProduct[] }) => {
  const t = useTranslations("ProductDetails.related");
  return (
    <section className="mt-20 overflow-hidden">
      <BasicAnimatedWrapper>
        <div className="mb-10">
          <h2 className="text-2xl text-center font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className="text-sm text-center text-secondary-foreground">
            {t("subtitle")}
          </p>
        </div>
        <ProductSliderSection products={products} />
      </BasicAnimatedWrapper>
    </section>
  );
};

export default RelatedProducts;
