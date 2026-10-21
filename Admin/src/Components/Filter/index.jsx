// ==========================================
// Component: Filter
// Dynamic multi-field filter control panel for data lists
// Desktop: inline filter selects
// Mobile: "Filters" button with active count badge opening a sleek bottom sheet
// ==========================================

import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button, Badge } from "../UI";

/**
 * Reusable dynamic filter bar generating select inputs based on config.
 * @param {Object} props
 * @param {Array<{field: string, label?: string, options: Array<string|{label: string, value: any}>}>} [props.filterConfig=[]] - Configuration array for each filter item
 * @param {Function} props.onFilterChange - Callback triggered when active filters change
 * @param {string} [props.className=""] - Custom CSS classes
 */
export default function Filter({ filterConfig = [], onFilterChange, className = "" }) {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const activeFiltersCount = Object.keys(selectedFilters).length;

  const handleSelectChange = (field, value) => {
    const newFilters = { ...selectedFilters };
    if (value === "") {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    setSelectedFilters(newFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  // Lock body scroll when mobile bottom sheet is open
  useEffect(() => {
    if (isBottomSheetOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsBottomSheetOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isBottomSheetOpen]);

  if (!filterConfig || filterConfig.length === 0) return null;

  return (
    <div className={`w-full md:w-auto ${className}`}>
      {/* 1. Mobile Filter Trigger Button (< md) */}
      <div className="flex md:hidden items-center gap-2 w-full">
        <button
          type="button"
          onClick={() => setIsBottomSheetOpen(true)}
          className={`
            flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer
            ${
              activeFiltersCount > 0
                ? "bg-primary-light border-primary text-text-accent shadow-xs"
                : "bg-surface border-border text-text-secondary hover:bg-surface-hover"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <FilterListIcon fontSize="small" className={activeFiltersCount > 0 ? "text-primary" : "text-text-muted"} />
            <span>فیلترها</span>
          </div>

          {activeFiltersCount > 0 ? (
            <Badge variant="primary" size="sm">
              {activeFiltersCount}
            </Badge>
          ) : (
            <span className="text-[11px] text-text-muted font-normal">همه</span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleClearFilters}
            title="پاکسازی فیلترها"
            aria-label="پاکسازی فیلترها"
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-error hover:border-error-border transition-colors cursor-pointer shrink-0"
          >
            <RestartAltIcon fontSize="small" />
          </button>
        )}
      </div>

      {/* 2. Desktop Inline Filter Controls (md+) */}
      <div className="hidden md:flex flex-wrap items-center gap-3">
        {filterConfig.map((config, index) => (
          <div key={index} className="flex flex-col gap-1 min-w-[140px]">
            {config.label && (
              <label className="text-xs font-semibold text-text-secondary select-none">
                {config.label}
              </label>
            )}
            <div className="relative flex items-center">
              <select
                className="w-full min-h-[42px] py-2 pl-8 pr-3 rounded-xl text-xs md:text-sm bg-surface text-text-primary border border-border hover:border-border-hover focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-200 outline-none appearance-none cursor-pointer shadow-xs"
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

        {activeFiltersCount > 0 && (
          <div className="self-end pb-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              title="پاکسازی فیلترها"
              icon={<RestartAltIcon fontSize="small" />}
              className="text-xs text-text-muted hover:text-error min-h-[42px]"
            >
              پاکسازی
            </Button>
          </div>
        )}
      </div>

      {/* 3. Mobile Bottom Sheet Overlay (< md) */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setIsBottomSheetOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal Panel */}
          <div
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-label="فیلترهای پیشرفته"
            className="relative z-50 w-full max-h-[85dvh] bg-surface rounded-t-3xl shadow-2xl border-t border-border flex flex-col overscroll-contain animate-slideUp pb-safe"
          >
            {/* Grab Handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-border-hover/80" />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-light">
              <div className="flex items-center gap-2">
                <FilterListIcon fontSize="small" className="text-primary" />
                <h3 className="font-extrabold text-secondary text-base">
                  فیلترهای پیشرفته
                </h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="primary" size="sm">
                    {activeFiltersCount} فعال
                  </Badge>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(false)}
                aria-label="بستن"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-neutral-100 transition-colors cursor-pointer"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            {/* Sheet Body (Scrollable form fields) */}
            <div className="p-5 flex flex-col gap-4 overflow-y-auto">
              {filterConfig.map((config, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                  {config.label && (
                    <label className="text-xs font-semibold text-text-primary select-none">
                      {config.label}
                    </label>
                  )}
                  <div className="relative flex items-center">
                    <select
                      className="w-full min-h-[44px] py-2.5 pl-9 pr-4 rounded-xl text-base bg-bg-light/60 text-text-primary border border-border focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none appearance-none cursor-pointer"
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
                    <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">
                      <KeyboardArrowDownIcon fontSize="small" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sheet Footer Actions */}
            <div className="p-4 border-t border-border-light flex items-center gap-3 bg-bg-light/40">
              {activeFiltersCount > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleClearFilters}
                  className="flex-1 text-xs"
                >
                  پاکسازی فیلترها
                </Button>
              )}

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setIsBottomSheetOpen(false)}
                className="flex-1 text-xs font-bold"
              >
                اعمال فیلترها
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
