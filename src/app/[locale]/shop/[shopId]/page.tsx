import ShopDetailsClient from "@/components/layout/Shop/ShopDetailsClient";

interface Props {
  params: Promise<{
    shopId: string;
  }>;
}

const getShopDetails = async (shopId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/shops/${shopId}`,
    {
      method: "GET",
      cache: "no-cache",
      next: { revalidate: 0 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const { data, success } = await response.json();

  if (success) {
    return data;
  }
};

const ShopPage = async ({ params }: Props) => {
  const { shopId } = await params;

  const shop = await getShopDetails(shopId);

  return <ShopDetailsClient shop={shop} />;
};

export default ShopPage;