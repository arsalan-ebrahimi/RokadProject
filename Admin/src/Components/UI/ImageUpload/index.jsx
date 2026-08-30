import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Notify from "../../../Utils/notify";

export function ImageUpload({
  label = "تصویر",
  error = null,
  imagePreview = null,
  onChange,
  height = "h-48",
  id = "img-upload",
  className = "",
  placeholder = "برای آپلود تصویر کلیک کنید",
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allowed image formats
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      Notify("error", "فرمت فایل غیرمجاز است. لطفاً JPG، PNG، SVG یا WEBP انتخاب کنید.");
      e.target.value = "";
      return;
    }

    if (file.name.toLowerCase().startsWith("default-")) {
      Notify("error", "نام فایل مجاز نیست. لطفاً نام فایل را تغییر دهید.");
      e.target.value = "";
      return;
    }

    if (onChange) {
      onChange(file);
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full text-right ${className}`}>
      {label && (
        <label className="text-xs md:text-sm font-semibold text-text-primary select-none">
          {label}
        </label>
      )}

      <div
        className={`
          w-full ${height} border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3
          transition-all duration-200 cursor-pointer relative overflow-hidden group
          ${
            error
              ? "border-error/70 bg-error-light/30 hover:bg-error-light/50"
              : "border-border hover:border-primary bg-bg-light/60 hover:bg-primary-light/40"
          }
        `}
      >
        <input
          id={id}
          type="file"
          accept="image/jpeg, image/jpg, image/png, image/svg+xml, image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 z-5">
              <CloudUploadIcon fontSize="medium" />
              <span className="text-xs font-semibold">تغییر تصویر</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-surface shadow-xs flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <CloudUploadIcon fontSize="medium" />
            </div>
            <p className="text-xs md:text-sm font-medium text-text-secondary">
              {placeholder}
            </p>
            <p className="text-[11px] text-text-muted">
              JPG, PNG, SVG یا WEBP
            </p>
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-error font-medium animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
}

export default ImageUpload;
