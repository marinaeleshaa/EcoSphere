import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";
import ProductSliderSection from "./ProductSliderSection";

const RelatedProducts = () => {
  return (
    <section className="mt-20 overflow-hidden">
      <BasicAnimatedWrapper>
        <div className="mb-10">
          <h2 className="text-2xl text-center font-semibold text-foreground">
            Related Products
          </h2>
          <p className="text-sm text-center text-secondary-foreground">
            explore our wide range of related products
          </p>
        </div>
        <ProductSliderSection />
      </BasicAnimatedWrapper>
    </section>
  );
};

export default RelatedProducts;
