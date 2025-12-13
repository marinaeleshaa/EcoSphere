import { IProduct } from "@/types/ProductType";
import ProductCardSection from "./ProductCardSection";

export const ProductCardSectionClient = ({ products }: { products: Promise<IProduct[]> }) => {
  return (
    <ProductCardSection products={products} />
  );
};