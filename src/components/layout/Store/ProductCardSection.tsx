import ProductCard from "./ProductCard";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import { IProduct } from "@/types/ProductType";

const ProductCardSection = async ({ products }: { products: Promise<IProduct[]> }) => {
  const data = await products;
  return (
    <section>
      <div className="w-[80%] mx-auto">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-15">
          {data.map((product, index) => (
            <BasicAnimatedWrapper key={product._id} index={index}>
              <ProductCard {...product} />
            </BasicAnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCardSection;
