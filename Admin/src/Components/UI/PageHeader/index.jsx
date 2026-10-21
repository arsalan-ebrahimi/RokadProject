// ==========================================
// UI Component: PageHeader
// Standardized header bar for admin pages with title, subtitle, back navigation, and action buttons
// Responsive design: title on top, full-width or compact action on mobile, inline toolbar on desktop
// ==========================================

import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "../Button";

/**
 * Reusable PageHeader component for consistent page titles and navigation.
 * @param {Object} props
 * @param {string} props.title - Primary page title
 * @param {string} [props.subtitle=null] - Subtitle or explanatory text
 * @param {React.ReactNode} [props.action=null] - Custom action elements/buttons rendered on the left/action area
 * @param {string} [props.backTo=null] - Route path to navigate on back click
 * @param {string} [props.backLabel="بازگشت"] - Label for the back button
 * @param {Function} [props.onBack=null] - Custom callback for back button click
 * @param {React.ReactNode} [props.children=null] - Additional elements rendered underneath header (e.g. search/filters)
 * @param {string} [props.className=""] - Custom CSS classes
 */
export function PageHeader({
  title,
  subtitle = null,
  action = null,
  backTo = null,
  backLabel = "بازگشت",
  onBack = null,
  children = null,
  className = "",
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      window.history.back();
    }
  };

  const showBackButton = Boolean(backTo || onBack);

  return (
    <div className={`flex flex-col mb-6 md:mb-8 border-b border-border/80 pb-4 md:pb-5 gap-4 md:gap-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
        {/* Title, Subtitle, and Single Unified Back Arrow Button */}
        <div className="flex items-start gap-3 min-w-0">
          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              aria-label={backLabel}
              title={backLabel}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border/80 bg-surface text-text-secondary hover:text-secondary hover:bg-surface-hover hover:border-border-hover active:bg-neutral-100 transition-all shrink-0 mt-0.5 cursor-pointer shadow-2xs"
            >
              <ArrowForwardIcon fontSize="small" />
            </button>
          )}

          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-secondary tracking-tight break-words">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-text-secondary font-medium leading-relaxed break-words">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Button Area (e.g. Create, Edit actions) */}
        {action && (
          <div className="flex items-center gap-3 w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto shrink-0">
            {action}
          </div>
        )}
      </div>

      {children && (
        <div className="w-full min-w-0">
          {children}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
