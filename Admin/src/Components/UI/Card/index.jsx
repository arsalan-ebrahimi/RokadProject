import React from "react";

export function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface rounded-xl border border-border/80 shadow-xs
        transition-all duration-200
        ${
          hoverable
            ? "hover:shadow-md hover:border-border cursor-pointer hover:-translate-y-0.5"
            : ""
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
