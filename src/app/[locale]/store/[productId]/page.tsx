import ProductDetailsCard from "@/components/layout/Store/productDetails/ProductDetailsCard";
import ProductHero from "@/components/layout/Store/productDetails/ProductHero";
import RelatedProducts from "@/components/layout/Store/productDetails/RelatedProducts";
import TextComponent from "@/components/layout/Store/productDetails/TextComponent";

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

const ProductPage = async ({ params }: Props) => {
  const { productId } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/${productId}`,
    {
      cache: "no-store",
    }
  );
  const { data: product } = await res.json();

  if (!product) {
    return <div>Product not found</div>;
  }

  // Fetch related products (e.g. from same shop)
  const relatedRes = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products?restaurantId=${product.restaurantId}&limit=10`,
    { cache: "no-store" }
  );
  const relatedData = await relatedRes.json();

  const relatedProducts = Array.isArray(relatedData.data)
    ? relatedData.data
    : Array.isArray(relatedData)
    ? relatedData
    : [];

  return (
    <div className="overflow-x-hidden">
      <ProductHero product={product} />
      <div className="w-[80%] mx-auto">
        <ProductDetailsCard product={product} />
        {/* <TextComponent product={product} /> */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
