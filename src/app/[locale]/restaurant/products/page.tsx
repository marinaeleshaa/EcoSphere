import { getCurrentUser } from "@/backend/utils/authHelper";
import ProductsClient from "@/components/layout/Products/ProductsClient";

export default async function ProductsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="p-10 text-center">Unauthorized</div>;
  }

  // Fetch initial data server-side
  const searchParams = new URLSearchParams({
    page: "1",
    limit: "5",
    search: "",
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/restaurants/${user.id}/products?${searchParams}`,
    { cache: "no-store" }
  );

  const json = await res.json();
  const initial = json.data.data;

  return (
    <ProductsClient
      restaurantId={user.id}
      initialProducts={initial.data ?? initial}
      initialMetadata={initial.metadata ?? null}
    />
  );
}
