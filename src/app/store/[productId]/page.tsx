import ProductDetailsCard from "@/components/layout/Store/productDetails/ProductDetailsCard";
import ProductHero from "@/components/layout/Store/productDetails/ProductHero";
import RelatedProducts from "@/components/layout/Store/productDetails/RelatedProducts";
import TextComponent from "@/components/layout/Store/productDetails/TextComponent";
import { products } from "@/data/products";

interface Props {
  params: {
    productId: string;
  };
}

const ProductPage = async ({ params }: Props) => {
  const { productId } = params;

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="overflow-x-hidden">
      <ProductHero product={product} />
      <div className="w-[80%] mx-auto">
        <ProductDetailsCard product={product} />
        <TextComponent product={product} />
        <RelatedProducts />
      </div>
    </div>
  );
};

export default ProductPage;
