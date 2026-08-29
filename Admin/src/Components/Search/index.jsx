import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Search({ onSearch, placeholder = "جستجو..." }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Debounce the search term
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 500);

    // Cleanup timer on every keystroke
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <SearchIcon className="text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full p-2.5 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#51b5a5] focus:border-[#51b5a5]"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
