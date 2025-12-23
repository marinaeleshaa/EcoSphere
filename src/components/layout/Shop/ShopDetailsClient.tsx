"use client";

import ShopHero from "./shopDetails/ShopHero";
import ShopDetailsCard from "./shopDetails/ShopDetailsCard";
import ShopProducts from "./shopDetails/ShopProducts";
import ShopTextComponent from "./shopDetails/ShopTextComponent";
import { IShop, IReview } from "@/types/ShopTypes";
import { useState, useMemo } from "react";
import { getAverageRating } from "./ShopSection";

function ShopDetailsClient({ shop }: { shop: IShop }) {
  const [reviews, _] = useState<IReview[]>(
    shop.restaurantRating || [],
  );

  const liveAverageRating = useMemo(() => {
    const shopWithLiveReviews = { ...shop, restaurantRating: reviews };
    return getAverageRating(shopWithLiveReviews);
  }, [reviews, shop]);

  return (
    <div className="overflow-x-hidden w-full">
      <ShopHero shop={shop} />
      <div className="w-[80%] mx-auto">
        <ShopDetailsCard shop={shop} liveAverageRating={liveAverageRating} />
        <ShopTextComponent reviews={reviews} shopId={shop._id} />
        <ShopProducts shop={shop} />
      </div>
    </div>
  );
}

export default ShopDetailsClient;
