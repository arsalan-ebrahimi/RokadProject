import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Search({
  onSearch,
  placeholder = "جستجو...",
  className = "",
  defaultValue = "",
}) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className={`relative w-full md:w-80 ${className}`}>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-text-muted">
        <SearchIcon fontSize="small" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 pr-10 pl-4 rounded-xl text-sm bg-surface text-text-primary placeholder:text-text-muted border border-border hover:border-border-hover focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-200 outline-none shadow-xs"
      />
    </div>
  );
}
