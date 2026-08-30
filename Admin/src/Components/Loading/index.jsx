import React from "react";
import { BeatLoader } from "react-spinners";

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