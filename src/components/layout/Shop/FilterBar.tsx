"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import { SortOption } from "@/types/ShopTypes";

export interface FilterBarProps {
  onSortChange: (sort: SortOption) => void;
  onSearch: (query: string) => void;
  isSorting?: boolean;
  currentSort: SortOption; // required now
  searchValue: string; // required now
}

export default function FilterBar({
  onSortChange,
  onSearch,
  isSorting = true,
  currentSort,
  searchValue,
}: Readonly<FilterBarProps>) {
  const t = useTranslations("Shop.filter");

  const sortOptions: SortOption[] = [
    "default",
    "highestRating",
    "lowestRating",
  ];

  return (
    <div className="w-[80%] mx-auto py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-primary rounded-full bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      {/* Sort Dropdown */}
      {isSorting && (
        <div className="w-full md:w-auto flex items-center gap-2 justify-end">
          <label
            htmlFor="sort-option"
            className="text-foreground font-semibold whitespace-nowrap"
          >
            {t("sortBy")}
          </label>
          <CustomDropdown
            options={sortOptions}
            selectedValue={currentSort}
            onChange={(value) => onSortChange(value as SortOption)}
          />
        </div>
      )}
    </div>
  );
}
