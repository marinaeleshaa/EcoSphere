"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ShopCard from "./ShopCard";
import FilterBar from "./FilterBar";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import { IShop } from "@/types/ShopTypes";

export const getAverageRating = (shop: IShop): number => {
  const ratings = shop?.restaurantRating;

  if (!ratings || ratings.length === 0) {
    return 0;
  }

  const validRatings = ratings
    .filter(
      (r) => r && typeof r.rate === "number" && r.rate >= 1 && r.rate <= 5
    )
    .map((r) => r.rate);

  if (validRatings.length === 0) {
    return 0;
  }

  const sum = validRatings.reduce((acc, rate) => acc + rate, 0);
  const average = sum / validRatings.length;
  return average;
};

export default function ShopSection({ shops }: { shops: IShop[] }) {
  const t = useTranslations("Shop.filter");
  const [currentSort, setCurrentSort] = useState(t("sortOptions.default"));
  const [searchQuery, setSearchQuery] = useState("");

  const processedShops = shops.filter((shop) => {
    const passesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    return passesSearch;
  });

  const sortedShops = [...processedShops].sort((a, b) => {
    const ratingA = getAverageRating(a);
    const ratingB = getAverageRating(b);

    if (currentSort === t("sortOptions.highestRating")) {
      return ratingB - ratingA;
    }
    if (currentSort === t("sortOptions.lowestRating")) {
      return ratingA - ratingB;
    }

    return 0;
  });

  return (
    <>
      <FilterBar
        onSortChange={setCurrentSort}
        onSearch={setSearchQuery}
        isSorting={true}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-15 auto-rows-auto w-[80%] mx-auto mb-4">
        {sortedShops.length > 0 ? (
          sortedShops.map((shop, index) => {
            return (
              <BasicAnimatedWrapper
                key={shop._id}
                index={index}
                delay={index * 0.1}
              >
                <ShopCard shop={shop} index={index} />
              </BasicAnimatedWrapper>
            );
          })
        ) : (
          <p className="col-span-full text-center text-primary-foreground py-10">
            {t("noProducts")}
          </p>
        )}
      </div>
    </>
  );
}
