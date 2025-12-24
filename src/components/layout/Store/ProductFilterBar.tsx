"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export type ProductSortOption = "default" | "priceHigh" | "priceLow";

export type ProductCategoryOption =
  | "default"
  | "Fruits"
  | "Vegetables"
  | "Meat"
  | "Dairy"
  | "Beverages"
  | "Snacks"
  | "Other";

export interface ProductFilterBarProps {
  onSortChange: (sort: ProductSortOption) => void;
  onCategoryChange: (category: ProductCategoryOption) => void;
  onSearch: (query: string) => void;
  isSorting?: boolean;
  currentSort: ProductSortOption;
  currentCategory: ProductCategoryOption;
  searchValue: string;
}

export default function ProductFilterBar({
  onSortChange,
  onCategoryChange,
  onSearch,
  isSorting = true,
  currentSort,
  currentCategory,
  searchValue,
}: Readonly<ProductFilterBarProps>) {
  const t = useTranslations("Store.filter");

  const [openDropdown, setOpenDropdown] = useState<"sort" | "filter" | null>(
    null,
  );

  const sortOptions: ProductSortOption[] = ["default", "priceHigh", "priceLow"];

  const categoryOptions: ProductCategoryOption[] = [
    "default",
    "Fruits",
    "Vegetables",
    "Meat",
    "Dairy",
    "Beverages",
    "Snacks",
    "Other",
  ];

  return (
    <div className="w-full py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-primary rounded-full bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {isSorting && (
        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
          {/* Sort */}
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <span className="font-semibold whitespace-nowrap">
              {t("sortBy")}
            </span>

            <Select
              value={currentSort}
              open={openDropdown === "sort"}
              onOpenChange={(open) => setOpenDropdown(open ? "sort" : null)}
              onValueChange={(value) =>
                onSortChange(value as ProductSortOption)
              }
            >
              <SelectTrigger className="w-48 rounded-full border-primary">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`sortOptions.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <span className="font-semibold whitespace-nowrap">
              {t("filterBy")}
            </span>

            <Select
              value={currentCategory}
              open={openDropdown === "filter"}
              onOpenChange={(open) => setOpenDropdown(open ? "filter" : null)}
              onValueChange={(value) =>
                onCategoryChange(value as ProductCategoryOption)
              }
            >
              <SelectTrigger className="w-48 rounded-full border-primary">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`filterOptions.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
