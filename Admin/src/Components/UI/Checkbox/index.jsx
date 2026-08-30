import React, { forwardRef, useId } from "react";

export const Checkbox = forwardRef(
  (
    {
      label,
      description,
      error,
      checked = false,
      onChange,
      disabled = false,
      variant = "default", // "default" | "card"
      size = "md", // "sm" | "md" | "lg"
      className = "",
      boxClassName = "",
      labelClassName = "",
      id,
      name,
      value,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || name || generatedId;

    // Size variants for the custom box
    const sizeConfig = {
      sm: {
        box: "w-4 h-4 rounded-[5px]",
        icon: "w-2.5 h-2.5",
        text: "text-xs",
      },
      md: {
        box: "w-5 h-5 rounded-lg",
        icon: "w-3.5 h-3.5",
        text: "text-xs md:text-sm",
      },
      lg: {
        box: "w-6 h-6 rounded-lg",
        icon: "w-4 h-4",
        text: "text-sm md:text-base",
      },
    };

    const currentSize = sizeConfig[size] || sizeConfig.md;

    // Card variant styling vs Default inline styling
    const isCard = variant === "card";

    const wrapperClasses = isCard
      ? `
        flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none relative group
        ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-bg-subtle border-border"
            : checked
            ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
            : "bg-surface border-border hover:border-border-hover text-text-primary"
        }
        ${error ? "border-error focus-within:ring-error/20" : ""}
        ${className}
      `
      : `
        inline-flex items-start gap-2.5 cursor-pointer select-none relative group
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `;

    return (
      <div className="flex flex-col gap-1 text-right">
        <label htmlFor={checkboxId} className={wrapperClasses}>
          {/* Visually hidden native input for accessibility & Formik compatibility */}
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />

          {/* Custom Styled Checkbox Box */}
          <div
            className={`
              relative flex items-center justify-center shrink-0 border transition-all duration-200
              peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20
              ${currentSize.box}
              ${
                disabled
                  ? "bg-bg-subtle border-border text-text-muted cursor-not-allowed"
                  : checked
                  ? "bg-primary border-primary text-white shadow-xs"
                  : error
                  ? "bg-surface border-error text-error"
                  : "bg-surface border-border group-hover:border-border-hover text-transparent"
              }
              ${boxClassName}
            `}
          >
            <svg
              className={`
                ${currentSize.icon} stroke-[3] transition-all duration-200 ease-out transform
                ${checked ? "scale-100 opacity-100" : "scale-50 opacity-0"}
              `}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* Label & Description Content */}
          {(label || children || description) && (
            <div className="flex flex-col flex-grow select-none">
              {(label || children) && (
                <span
                  className={`
                    ${currentSize.text} font-medium leading-tight transition-colors duration-200
                    ${
                      disabled
                        ? "text-text-muted"
                        : isCard && checked
                        ? "text-primary"
                        : "text-text-primary"
                    }
                    ${labelClassName}
                  `}
                >
                  {label || children}
                </span>
              )}
              {description && (
                <span className="text-[11px] md:text-xs text-text-muted font-normal mt-0.5 leading-relaxed">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>

        {/* Inline Error Message */}
        {error && typeof error === "string" && (
          <span className="text-xs text-error font-medium animate-fadeIn mr-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
