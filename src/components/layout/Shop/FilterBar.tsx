// FilterBar.jsx
import React, { useState } from "react";
import CustomDropdown from "./CustomDropdown";

interface FilterBarProps {
  onSortChange: (sortType: string) => void; // Changed from onFilterChange
  onSearch: (query: string) => void;
  isSorting: boolean; // Flag to change the label/options
}

export default function FilterBar({
  onSortChange,
}: FilterBarProps) {
  const [selectedSort, setSelectedSort] = useState("Default");

  // New options for sorting by rating
  const sortOptions = ["Default", "Highest Rating", "Lowest Rating"];

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange(value); // Calls the handler passed down from ShopSection
  };

  return (
    <div className="w-[80%] mx-auto py-8 flex flex-col md:flex-row gap-4 items-center justify-end">
      {/* ... Search Input (No change) ... */}

      {/* Sort Dropdown */}
      <div className="w-full md:w-auto flex items-center gap-2">
        {/* Changed label text */}
        <label
          htmlFor="sort-option"
          className="text-foreground font-semibold whitespace-nowrap"
        >
          Sort by:
        </label>

        <CustomDropdown
          options={sortOptions}
          selectedValue={selectedSort}
          onChange={handleSortChange} // Calls the new handler
        />
      </div>
    </div>
  );
}
