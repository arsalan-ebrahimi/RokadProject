// ==========================================
// UI Component: Badge
// Compact label chip supporting various semantic colors, sizes, and status indicator dots
// ==========================================

import React from "react";

/**
 * Reusable Badge / Chip component.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge text/content
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'neutral'|'pink'|'indigo'|'purple'|'yellow'} [props.variant='primary'] - Color variant
 * @param {'sm'|'md'} [props.size='sm'] - Size variant
 * @param {boolean} [props.dot=false] - Whether to render a leading status dot indicator
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function Badge({
  children,
  variant = "primary",
  size = "sm",
  dot = false,
  className = "",
  ...props
}) {
  const sizeClasses = {
    sm: "text-2xs px-2.5 py-0.5 rounded-full font-demibold gap-1.5 leading-tight",
    md: "text-xs px-3 py-1 rounded-full font-demibold gap-2 leading-tight",
  };

  const variantClasses = {
    primary: "bg-primary-light text-text-accent border border-primary-border",
    secondary: "bg-secondary-light text-secondary border border-secondary-muted",
    success: "bg-success-light text-success-text border border-success-border",
    danger: "bg-error-light text-error-text border border-error-border",
    warning: "bg-warning-light text-warning-text border border-warning-border",
    info: "bg-info-light text-info-text border border-info-border",
    neutral: "bg-bg-subtle text-text-secondary border border-border-subtle",
    pink: "bg-pink-50 text-pink-700 border border-pink-200",
    indigo: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    yellow: "bg-yellow-50 text-yellow-800 border border-yellow-200",
  };

  const dotColorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    danger: "bg-error",
    warning: "bg-warning",
    info: "bg-info",
    neutral: "bg-text-muted",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
  };

  return (
    <span
      className={`
        inline-flex items-center select-none shrink-0 transition-colors
        ${sizeClasses[size] || sizeClasses.sm}
        ${variantClasses[variant] || variantClasses.primary}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColorClasses[variant] || "bg-primary"
          }`}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
