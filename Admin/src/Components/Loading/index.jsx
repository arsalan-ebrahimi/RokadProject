// ==========================================
// Component: Loading
// Compact animated loading spinner wrapper using react-spinners BeatLoader
// ==========================================

import React from "react";
import { BeatLoader } from "react-spinners";

/**
 * Reusable Loading indicator spinner.
 * @param {Object} props
 * @param {string} [props.color="var(--color-primary)"] - Spinner color
 * @param {number} [props.size=8] - Dot radius size in pixels
 * @param {number} [props.margin=2] - Margin between dots
 * @param {string} [props.className=""] - Additional CSS classes
 */
export default function Loading({
  color = "var(--color-primary)",
  size = 8,
  margin = 2,
  className = "",
}) {
  return (
    <div className={`inline-flex justify-center items-center ${className}`}>
      <BeatLoader size={size} color={color} margin={margin} />
    </div>
  );
}