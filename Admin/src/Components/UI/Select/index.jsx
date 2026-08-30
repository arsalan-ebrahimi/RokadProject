import React, { forwardRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = "انتخاب کنید",
      children,
      className = "",
      id,
      name,
      ...props
    },
    ref
  ) => {
    const selectId = id || name;

    return (
      <div className="flex flex-col gap-1.5 w-full text-right">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs md:text-sm font-semibold text-text-primary select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            name={name}
            className={`
              w-full py-2.5 pl-9 pr-4 rounded-xl text-sm bg-surface text-text-primary
              border transition-all duration-200 outline-none appearance-none cursor-pointer
              disabled:bg-bg-subtle disabled:text-text-muted disabled:cursor-not-allowed
              ${
                error
                  ? "border-error focus:border-error focus:ring-4 focus:ring-error/15"
                  : "border-border hover:border-border-hover focus:border-primary focus:ring-4 focus:ring-primary/15"
              }
              ${className}
            `}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {children
              ? children
              : options.map((option, index) => {
                  const isObj = typeof option === "object" && option !== null;
                  const val = isObj ? option.value : option;
                  const lbl = isObj ? option.label : option;
                  return (
                    <option key={index} value={val}>
                      {lbl}
                    </option>
                  );
                })}
          </select>

          <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">
            <KeyboardArrowDownIcon fontSize="small" />
          </div>
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

Select.displayName = "Select";
export default Select;
