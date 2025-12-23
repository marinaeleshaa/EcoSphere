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

import { SortOption, CategoryOption } from "@/types/ShopTypes";

export interface FilterBarProps {
  onSortChange: (sort: SortOption) => void;
  onCategoryChange: (category: CategoryOption) => void;
  onSearch: (query: string) => void;
  isSorting?: boolean;
  currentSort: SortOption;
  currentCategory: CategoryOption;
  searchValue: string;
}

export default function FilterBar({
  onSortChange,
  onCategoryChange,
  onSearch,
  isSorting = true,
  currentSort,
  currentCategory,
  searchValue,
}: Readonly<FilterBarProps>) {
  const t = useTranslations("Shop.filter");

  const [openDropdown, setOpenDropdown] = useState<"sort" | "filter" | null>(
    null,
  );

  const sortOptions: SortOption[] = [
    "default",
    "highestRating",
    "lowestRating",
  ];

  const categoryOptions: CategoryOption[] = [
    "default",
    "supermarket",
    "hypermarket",
    "grocery",
    "bakery",
    "cafe",
    "other",
  ];

  return (
    <div className="w-[80%] mx-auto py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
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
        <div className="flex gap-6">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="font-semibold whitespace-nowrap">
              {t("sortBy")}
            </span>

            <Select
              value={currentSort}
              open={openDropdown === "sort"}
              onOpenChange={(open) => setOpenDropdown(open ? "sort" : null)}
              onValueChange={(value) => onSortChange(value as SortOption)}
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
          <div className="flex items-center gap-2">
            <span className="font-semibold whitespace-nowrap">
              {t("filterBy")}
            </span>

            <Select
              value={currentCategory}
              open={openDropdown === "filter"}
              onOpenChange={(open) => setOpenDropdown(open ? "filter" : null)}
              onValueChange={(value) =>
                onCategoryChange(value as CategoryOption)
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
