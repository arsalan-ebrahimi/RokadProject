// ==========================================
// UI Component: PageHeader
// Standardized header bar for admin pages with title, subtitle, back navigation, and action buttons
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
    <div className={`flex flex-col mb-8 border-b border-border/80 pb-5 gap-5 ${className}`}>
      <div className="flex justify-between items-center w-full flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-secondary tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-text-secondary font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {action}

          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              icon={<ArrowForwardIcon fontSize="small" />}
              className="text-text-secondary hover:text-secondary font-semibold"
            >
              {backLabel}
            </Button>
          )}
        </div>
      </div>

      {children && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
