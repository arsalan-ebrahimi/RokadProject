// ==========================================
// UI Component: Card
// Flexible surface container with optional hover elevation effects
// ==========================================

import React from "react";

/**
 * Reusable Card container component.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content elements
 * @param {string} [props.className=''] - Custom CSS classes
 * @param {boolean} [props.hoverable=false] - Enables hover translation and shadow lift
 * @param {Function} [props.onClick] - Click handler
 */
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
