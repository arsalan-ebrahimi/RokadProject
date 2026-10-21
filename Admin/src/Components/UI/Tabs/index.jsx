// ==========================================
// UI Component: Tabs
// Accessible, responsive horizontal tab bar with edge indicators and auto-scroll-into-view
// ==========================================

import React, { useRef, useEffect } from "react";

/**
 * Reusable accessible tab list component.
 * @param {Object} props
 * @param {Array<{id: string, label: string, icon?: React.ReactNode, count?: number}>} props.tabs - Array of tab objects
 * @param {string} props.activeTab - Currently active tab ID
 * @param {Function} props.onChange - Callback invoked with selected tab ID
 * @param {string} [props.className=""] - Outer container classes
 */
export function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  const tabListRef = useRef(null);
  const activeTabRef = useRef(null);

  // Auto-scroll active tab into view when active tab changes
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  // Keyboard navigation across tabs
  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowLeft") {
      // In RTL, left arrow moves to next tab
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      onChange(tabs[nextIndex].id);
    } else if (e.key === "ArrowRight") {
      // In RTL, right arrow moves to previous tab
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      onChange(tabs[prevIndex].id);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Scrollable Container with edge padding */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        className="w-full flex items-center gap-1.5 bg-surface p-1.5 rounded-2xl border border-border shadow-2xs overflow-x-auto hide-scrollbar scroll-smooth"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              type="button"
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[44px] select-none
                ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-light active:bg-neutral-100"
                }
              `}
            >
              {tab.icon && <span className="shrink-0 flex items-center">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`
                    px-2 py-0.5 rounded-full text-[11px] font-numeric
                    ${isActive ? "bg-white/20 text-white" : "bg-bg-subtle text-text-muted"}
                  `}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
