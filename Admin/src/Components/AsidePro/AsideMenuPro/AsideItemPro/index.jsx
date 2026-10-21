// ==========================================
// Layout Component: AsideItemPro
// Interactive sidebar navigation button with active indicator pill, icon slot, and collapsed mode
// ==========================================

import React from "react";

/**
 * Individual sidebar navigation link button.
 * @param {Object} props
 * @param {string} props.title - Nav item display label
 * @param {React.ReactNode} [props.icon] - Nav item icon
 * @param {Function} props.onClick - Click handler navigating to the item route
 * @param {boolean} [props.isActive=false] - Whether current route matches this item
 * @param {boolean} [props.isCollapsed=false] - Whether sidebar is in collapsed icon-only mode
 */
export function AsideItemPro({
  title,
  icon = null,
  onClick,
  isActive = false,
  isCollapsed = false,
}) {
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        className={`
          w-full min-h-[44px] h-11 p-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center relative group
          ${
            isActive
              ? "bg-primary text-text-white shadow-sm shadow-primary/30"
              : "text-text-secondary hover:bg-primary-light hover:text-primary active:bg-primary-muted"
          }
        `}
      >
        {icon && <span className="text-xl flex items-center justify-center">{icon}</span>}
        {isActive && (
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-l-full bg-primary md:hidden"></span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      className={`
        w-full text-xs md:text-[13.5px] font-medium min-h-[44px] py-2.5 px-3 rounded-xl cursor-pointer text-right transition-all duration-200 flex items-center justify-between gap-3
        ${
          isActive
            ? "bg-primary text-text-white font-bold shadow-sm shadow-primary/30"
            : "text-text-secondary hover:bg-primary-light hover:text-primary active:bg-primary-muted"
        }
      `}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <span
            className={`text-lg shrink-0 flex items-center ${
              isActive ? "text-white" : "text-text-secondary group-hover:text-primary"
            }`}
          >
            {icon}
          </span>
        )}
        <span className="truncate">{title}</span>
      </div>

      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse"></span>
      )}
    </button>
  );
}

export default AsideItemPro;