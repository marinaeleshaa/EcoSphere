"use client";
import { useTranslations } from "next-intl";
import ShopCard from "./ShopCard";
import FilterBar from "./FilterBar";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import Pagination from "@/components/ui/Pagination";
import { IShop, SortOption } from "@/types/ShopTypes";

interface ShopSectionProps {
  shops: IShop[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const getAverageRating = (shop: IShop): number => {
  const ratings = shop?.restaurantRating || [];
  const validRatings = ratings.filter(r => r?.rate >= 1 && r?.rate <= 5).map(r => r.rate);
  if (validRatings.length === 0) return 0;
  return validRatings.reduce((sum, rate) => sum + rate, 0) / validRatings.length;
};

export default function ShopSection({
  shops,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  currentSort,
  onSortChange,
  searchQuery,
  onSearchChange,
}: ShopSectionProps) {
  const t = useTranslations("Shop.filter");

  return (
    <>
      <FilterBar
        onSortChange={onSortChange}
        onSearch={onSearchChange}
        currentSort={currentSort}
        searchValue={searchQuery}
        isSorting={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 auto-rows-auto w-[80%] mx-auto mb-4">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <BasicAnimatedWrapper key={idx} index={idx} delay={idx * 0.1}>
                <ShopCard loading index={idx} />
              </BasicAnimatedWrapper>
            ))
          : shops.map((shop, idx) => (
              <BasicAnimatedWrapper key={shop._id} index={idx} delay={idx * 0.1}>
                <ShopCard shop={shop} index={idx} />
              </BasicAnimatedWrapper>
            ))}
      </div>

      {!loading && shops.length === 0 && (
        <p className="col-span-full text-center text-foreground py-10">
          {t("noProducts")}
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
