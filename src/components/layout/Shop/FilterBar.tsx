"use client";

import React, { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface FilterBarProps {
  onSortChange: (sortType: string) => void;
  onSearch: (query: string) => void;
  isSorting: boolean;
}

export default function FilterBar({
  onSortChange,
  onSearch,
}: Readonly<FilterBarProps>) {
  const t = useTranslations("Shop.filter");
  const [selectedSort, setSelectedSort] = useState(t("sortOptions.default"));
  const [searchQuery, setSearchQuery] = useState("");

  const sortOptions = [
    t("sortOptions.default"),
    t("sortOptions.highestRating"),
    t("sortOptions.lowestRating"),
  ];

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="w-[80%] mx-auto py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-primary rounded-full bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="w-full md:w-auto flex items-center gap-2 justify-end">
        <label
          htmlFor="sort-option"
          className="text-foreground font-semibold whitespace-nowrap"
        >
          {t("sortBy")}
        </label>

        <CustomDropdown
          options={sortOptions}
          selectedValue={selectedSort}
          onChange={handleSortChange}
        />
      </div>
    </div>
  );
}
