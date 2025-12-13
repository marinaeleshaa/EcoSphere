"use client";

import ShopHero from "./shopDetails/ShopHero";
import ShopDetailsCard from "./shopDetails/ShopDetailsCard";
import ShopProducts from "./shopDetails/ShopProducts";
import ShopTextComponent from "./shopDetails/ShopTextComponent";
import { IShop, IReview } from "@/types/ShopTypes";
import { useState, useCallback, useMemo } from "react";
import { getAverageRating } from "./ShopSection";

function ShopDetailsClient({ shop }: { shop: IShop }) {
  const [reviews, setReviews] = useState<IReview[]>(
    shop.restaurantRating || []
  );

  const handleReviewAdded = useCallback((newReview: IReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  }, []);

  const liveAverageRating = useMemo(() => {
    const shopWithLiveReviews = { ...shop, restaurantRating: reviews };
    return getAverageRating(shopWithLiveReviews);
  }, [reviews, shop]);

  return (
    <div className="overflow-x-hidden">
      <ShopHero shop={shop} />
      <div className="w-[80%] mx-auto">
        <ShopDetailsCard
          shop={shop}
          liveAverageRating={liveAverageRating}
          onReviewAdded={handleReviewAdded}
        />
        <ShopTextComponent reviews={reviews} />
        <ShopProducts shopName={shop.name} />
      </div>
    </div>
  );
}

export default ShopDetailsClient;
