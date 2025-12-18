import ProductCard from "./ProductCard";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import { IProduct } from "@/types/ProductType";

const ProductCardSection = async ({
  products,
}: {
  products: Promise<IProduct[]>;
}) => {
  const data = await products;

  return (
    <div className="w-[80%] mx-auto">
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-15 mb-5">
        {data.map((product, index) => (
          <BasicAnimatedWrapper key={product.id} index={index}>
            <ProductCard product={product} />
          </BasicAnimatedWrapper>
        ))}
      </div>
    </div>
  );
};

export default ProductCardSection;
