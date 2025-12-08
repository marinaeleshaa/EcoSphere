import ShopClient from "@/components/layout/Shop/ShopClient";

const getShops = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/shops`, {
    method: "GET",
    cache: "no-cache",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    console.log(response)
    throw new Error("Failed to fetch data");
  }

  const { data, success } = await response.json();

  if (success) {
    return data;
  }
};

export default async function Shop() {
  const shops = await getShops();

  return (
      <ShopClient shops={shops} />
  );
}