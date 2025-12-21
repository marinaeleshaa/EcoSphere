import { getProducts } from "@/frontend/api/Store";
import ProductCardSection from "./ProductCardSection";

export default async function StoreClient() {
  const { data } = await getProducts();

  return (
    <>
      <ProductCardSection products={data} />
    </>
  );
}
