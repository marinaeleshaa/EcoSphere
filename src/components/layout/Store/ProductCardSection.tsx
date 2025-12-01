import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";

const ProductCardSection = () => {
  return (
    <section>
      <div className="w-[80%] mx-auto">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-15">
          {products.map((product, index) => (
            <BasicAnimatedWrapper key={product.id} index={index}>
              <ProductCard {...product} />
            </BasicAnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCardSection;
