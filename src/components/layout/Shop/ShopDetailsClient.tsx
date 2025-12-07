import ShopHero from "./shopDetails/ShopHero";
import ShopDetailsCard from "./shopDetails/ShopDetailsCard";
import ShopProducts from "./shopDetails/ShopProducts";
import ShopTextComponent from "./shopDetails/ShopTextComponent";
import { IShop } from "@/types/ShopTypes";

function ShopDetailsClient({ shop }: { shop: IShop }) {
  return (
    <div className="overflow-x-hidden">
      <ShopHero shop={shop} />
      <div className="w-[80%] mx-auto">
        <ShopDetailsCard shop={shop} />
        <ShopTextComponent shop={shop} />
        <ShopProducts shopName={shop.name} />
      </div>
    </div>
  );
}

export default ShopDetailsClient;
