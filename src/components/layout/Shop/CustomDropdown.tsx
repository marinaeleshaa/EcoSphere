"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CustomDropdownProps {
  options: string[]; // These are translation keys, e.g. "sortOptions.default"
  selectedValue: string; // also a translation key
  onChange: (value: string) => void;
  namespace?: string; // optional namespace for translations
}

export default function CustomDropdown({
  options,
  selectedValue,
  onChange,
  namespace,
}: Readonly<CustomDropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations(namespace ?? "Shop.filter.sortOptions");

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-20">
      {/* Button/Display Area */}
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-lg border border-primary bg-background text-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/25 transition duration-150"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {t(selectedValue)}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-2xl bg-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
        >
          <div className="py-1">
            {options.map((optionKey) => (
              <button
                key={optionKey}
                onClick={() => handleSelect(optionKey)}
                className={`block w-full text-left px-4 py-2 text-lg transition duration-100 ${
                  selectedValue === optionKey
                    ? "bg-gray-300 text-gray-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                role="menuitem"
              >
                {t(optionKey)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
