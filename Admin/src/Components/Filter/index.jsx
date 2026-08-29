import React, { useState, useEffect } from "react";

// ==========================================
// Component: Filter
// Description: A reusable, dynamic filter component that renders dropdowns
// based on provided configuration and returns selected values.
// ==========================================
export default function Filter({ filterConfig = [], onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleSelectChange = (field, value) => {
    const newFilters = { ...selectedFilters };
    if (value === "") {
      delete newFilters[field]; // Remove from filters if 'All' is selected
    } else {
      newFilters[field] = value;
    }
    
    setSelectedFilters(newFilters);
  };

  // Whenever local filter state changes, propagate it up to the parent
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters]);

  if (!filterConfig || filterConfig.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filterConfig.map((config, index) => (
        <div key={index} className="flex flex-col">
          {config.label && (
            <label className="text-xs text-gray-500 mb-1">{config.label}</label>
          )}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-700 min-w-[150px]"
            value={selectedFilters[config.field] || ""}
            onChange={(e) => handleSelectChange(config.field, e.target.value)}
          >
            <option value="">همه</option>
            {config.options.map((option, optIdx) => (
              <option key={optIdx} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
