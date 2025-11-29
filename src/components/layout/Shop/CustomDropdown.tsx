// CustomDropdown.jsx (New file)
import React, { useState } from "react";

interface CustomDropdownProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function CustomDropdown({
  options,
  selectedValue,
  onChange,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-20">
      {/* Button/Display Area - Looks like the 'All' button in your image */}
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-lg border border-primary bg-background text-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-800 transition duration-150"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {selectedValue}
        {/* Simple arrow icon */}
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

      {/* Dropdown Menu - The light gray modal area */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-2xl bg-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
        >
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`block w-full text-left px-4 py-2 text-lg transition duration-100 
                            ${
                              selectedValue === option
                                ? "bg-gray-300 text-gray-900 font-semibold" // Selected/Active style
                                : "text-gray-700 hover:bg-gray-200" // Default style
                            }`}
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
