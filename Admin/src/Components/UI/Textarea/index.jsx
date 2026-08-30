import React, { forwardRef } from "react";

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      rows = 4,
      className = "",
      id,
      name,
      ...props
    },
    ref
  ) => {
    const textareaId = id || name;

    return (
      <div className="flex flex-col gap-1.5 w-full text-right">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs md:text-sm font-semibold text-text-primary select-none"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          className={`
            w-full py-2.5 px-4 rounded-xl text-sm bg-surface text-text-primary placeholder:text-text-muted
            border transition-all duration-200 outline-none resize-y
            disabled:bg-bg-subtle disabled:text-text-muted disabled:cursor-not-allowed
            ${
              error
                ? "border-error focus:border-error focus:ring-4 focus:ring-error/15"
                : "border-border hover:border-border-hover focus:border-primary focus:ring-4 focus:ring-primary/15"
            }
            ${className}
          `}
          {...props}
        />

        {error && (
          <span className="text-xs text-error font-medium animate-fadeIn">
            {error}
          </span>
        )}

        {!error && helperText && (
          <span className="text-xs text-text-muted font-normal">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
