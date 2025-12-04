"use client";

import React, { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { useTranslations } from 'next-intl';

interface FilterBarProps {
  onSortChange: (sortType: string) => void;
  onSearch: (query: string) => void;
  isSorting: boolean;
}

export default function FilterBar({
  onSortChange,
}: FilterBarProps) {
  const t = useTranslations('Shop.filter');
  const [selectedSort, setSelectedSort] = useState(t('sortOptions.default'));

  // Get translated sort options
  const sortOptions = [
    t('sortOptions.default'),
    t('sortOptions.highestRating'),
    t('sortOptions.lowestRating')
  ];

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  return (
    <div className="w-[80%] mx-auto py-8 flex flex-col md:flex-row gap-4 items-center justify-end">
      {/* Sort Dropdown */}
      <div className="w-full md:w-auto flex items-center gap-2">
        <label
          htmlFor="sort-option"
          className="text-foreground font-semibold whitespace-nowrap"
        >
          {t('sortBy')}
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
