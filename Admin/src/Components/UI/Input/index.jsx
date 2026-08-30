import React, { forwardRef } from "react";

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon = null,
      dir,
      className = "",
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="flex flex-col gap-1.5 w-full text-right">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs md:text-sm font-semibold text-text-primary select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-text-muted">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            dir={dir}
            className={`
              w-full py-2.5 px-4 rounded-xl text-sm bg-surface text-text-primary placeholder:text-text-muted
              border transition-all duration-200 outline-none
              disabled:bg-bg-subtle disabled:text-text-muted disabled:cursor-not-allowed
              ${icon ? "pr-10" : "pr-4"}
              ${
                error
                  ? "border-error focus:border-error focus:ring-4 focus:ring-error/15"
                  : "border-border hover:border-border-hover focus:border-primary focus:ring-4 focus:ring-primary/15"
              }
              ${className}
            `}
            {...props}
          />
        </div>

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

Input.displayName = "Input";
export default Input;
