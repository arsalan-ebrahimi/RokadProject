// ==========================================
// UI Component: Button
// Versatile button supporting multiple sizes, semantic variants, icons, and loading state
// ==========================================

import React, { forwardRef } from "react";
import Loading from "../../Loading";

/**
 * Reusable Button component with built-in loading and theme styling.
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Button label/content
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type
 * @param {'primary'|'secondary'|'outline'|'danger'|'danger-outline'|'ghost'|'danger-ghost'|'info-ghost'|'primary-subtle'} [props.variant='primary'] - Visual style variant
 * @param {'sm'|'md'|'lg'|'tall'|'icon'|'icon-sm'} [props.size='md'] - Size variant
 * @param {boolean} [props.isLoading=false] - Whether button is in loading state
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {React.ReactNode} [props.icon=null] - Leading icon element
 * @param {string} [props.className=''] - Additional custom CSS classes
 * @param {Function} [props.onClick] - Click event handler
 */
export const Button = forwardRef(
  (
    {
      children,
      type = "button",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      icon = null,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    // Base classes with smooth transitions and focus ring
    const baseClasses =
      "inline-flex items-center justify-center font-bold select-none cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 relative overflow-hidden";

    // Size variants
    const sizeClasses = {
      sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[34px]",
      md: "text-sm px-5 py-2.5 rounded-xl gap-2 min-h-[42px]",
      lg: "text-base px-8 py-3 rounded-xl gap-2.5 min-h-[50px] min-w-btn-wide",
      tall: "text-base px-8 h-btn-tall rounded-2xl gap-2.5 min-w-btn-wide shadow-md",
      icon: "p-2 rounded-xl text-sm min-h-[38px] min-w-[38px] justify-center",
      "icon-sm": "p-1.5 rounded-lg text-xs min-h-[30px] min-w-[30px] justify-center",
    };

    // Color/Style variants
    const variantClasses = {
      primary:
        "bg-primary text-text-white hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary/25 shadow-sm hover:shadow-md hover:shadow-primary/20",
      secondary:
        "bg-secondary text-text-white hover:bg-secondary-hover active:bg-secondary-hover/90 focus-visible:ring-secondary/25 shadow-sm hover:shadow",
      outline:
        "border border-border bg-surface text-text-primary hover:bg-surface-hover hover:border-border-hover active:bg-neutral-100 focus-visible:ring-primary/25",
      danger:
        "bg-error text-text-white hover:bg-error-hover active:bg-error-hover/90 focus-visible:ring-error/25 shadow-sm hover:shadow-md hover:shadow-error/20",
      "danger-outline":
        "border border-error-border bg-error-light text-error-text hover:bg-error-border/40 active:bg-error-border/60 focus-visible:ring-error/25",
      ghost:
        "text-text-secondary hover:bg-surface-hover hover:text-text-primary active:bg-neutral-100 focus-visible:ring-primary/25",
      "danger-ghost":
        "text-error hover:bg-error-light active:bg-error-border/40 focus-visible:ring-error/25",
      "info-ghost":
        "text-info hover:bg-info-light active:bg-info-border/40 focus-visible:ring-info/25",
      "primary-subtle":
        "bg-primary-light text-text-accent hover:bg-primary-muted active:bg-teal-200 border border-primary-border focus-visible:ring-primary/25",
    };

    const isInteractionDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isInteractionDisabled}
        onClick={onClick}
        className={`
          ${baseClasses}
          ${sizeClasses[size] || sizeClasses.md}
          ${variantClasses[variant] || variantClasses.primary}
          ${isInteractionDisabled ? "!pointer-events-none" : "active:scale-[0.98]"}
          ${className}
        `}
        {...props}
      >
        {/* Loading state preservation: Render invisible content to retain dimensions + absolute centered loader */}
        {isLoading ? (
          <>
            <span className="invisible flex items-center gap-2">
              {icon && <span className="shrink-0">{icon}</span>}
              {children}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loading
                size={size === "sm" || size === "icon" || size === "icon-sm" ? 6 : 8}
                color={
                  variant === "outline" ||
                  variant === "ghost" ||
                  variant === "info-ghost" ||
                  variant === "primary-subtle"
                    ? "var(--color-primary)"
                    : variant === "danger-ghost" || variant === "danger-outline"
                    ? "var(--color-error)"
                    : "var(--color-white)"
                }
              />
            </div>
          </>
        ) : (
          <>
            {icon && <span className="shrink-0 flex items-center">{icon}</span>}
            {children && <span>{children}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
