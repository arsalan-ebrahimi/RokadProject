import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Filter({ filterConfig = [], onFilterChange, className = "" }) {
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleSelectChange = (field, value) => {
    const newFilters = { ...selectedFilters };
    if (value === "") {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    setSelectedFilters(newFilters);
  };

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  if (!filterConfig || filterConfig.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {filterConfig.map((config, index) => (
        <div key={index} className="flex flex-col gap-1 min-w-[140px]">
          {config.label && (
            <label className="text-xs font-semibold text-text-secondary select-none">
              {config.label}
            </label>
          )}
          <div className="relative flex items-center">
            <select
              className="w-full py-2 pl-8 pr-3 rounded-xl text-xs md:text-sm bg-surface text-text-primary border border-border hover:border-border-hover focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-200 outline-none appearance-none cursor-pointer shadow-xs"
              value={selectedFilters[config.field] || ""}
              onChange={(e) => handleSelectChange(config.field, e.target.value)}
            >
              <option value="">همه</option>
              {config.options.map((option, optIdx) => {
                const isObj = typeof option === "object" && option !== null;
                const val = isObj ? option.value : option;
                const lbl = isObj ? option.label : option;
                return (
                  <option key={optIdx} value={val}>
                    {lbl}
                  </option>
                );
              })}
            </select>
            <div className="absolute left-2.5 flex items-center pointer-events-none text-text-muted">
              <KeyboardArrowDownIcon style={{ fontSize: "1.1rem" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
