import ProductCard from "./ProductCard";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import { IProduct } from "@/types/ProductType";

const ProductCardSection = ({ products }: { products: IProduct[] }) => {
  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-15 mb-5">
      {products.map((product, index) => (
        <BasicAnimatedWrapper key={product.id} index={index}>
          <ProductCard product={product} />
        </BasicAnimatedWrapper>
      ))}
    </div>
  );
};

export default ProductCardSection;
