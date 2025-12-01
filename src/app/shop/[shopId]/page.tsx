import ShopDetailsCard from "@/components/layout/Shop/shopDetails/ShopDetailsCard";
import ShopHero from "@/components/layout/Shop/shopDetails/ShopHero";
import ShopProducts from "@/components/layout/Shop/shopDetails/ShopProducts";
import ShopTextComponent from "@/components/layout/Shop/shopDetails/ShopTextComponent";
import { shops } from "@/data/shops";

interface Props {
  params: {
    shopId: string;
  };
}

const ShopPage = async ({ params }: Props) => {
  const { shopId } = await params;

  const shop = shops.find((s) => s.id === Number(shopId));

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div className="overflow-x-hidden">
      <ShopHero shop={shop} />
      <div className="w-[80%] mx-auto">
        <ShopDetailsCard shop={shop} />
        <ShopTextComponent shop={shop} />
        <ShopProducts shopName={shop.shopName} />
      </div>
    </div>
  );
};

export default ShopPage;
