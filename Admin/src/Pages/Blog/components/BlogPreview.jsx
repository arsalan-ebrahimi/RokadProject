// ==========================================
// Component: BlogPreview
// High-fidelity live article preview with Desktop/Mobile viewport switcher
// Renders strictly the article content without any admin navbar/footer
// Fully responsive on small mobile (320px) up to ultra-wide displays
// ==========================================

import React, { useState } from "react";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Badge } from "../../../Components/UI";
import { getImageUrl } from "../../../Utils/getImageUrl";

export default function BlogPreview({
  title = "",
  date = "",
  description = "",
  img = null,
  imagePreview = null,
  tags = [],
  tableOfContents = [],
  htmlContent = "",
}) {
  const [viewportMode, setViewportMode] = useState("desktop"); // "desktop" | "mobile"

  // Determine final image source (blob preview or stored filename)
  const resolvedImage =
    imagePreview || (img ? (typeof img === "string" ? getImageUrl(img) : null) : null);

  // Convert English digits to Persian numerals for TOC numbering
  const toPersianNum = (n) => {
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
  };

  return (
    <div className="flex flex-col items-center w-full bg-slate-100/70 p-2 sm:p-4 md:p-6 rounded-2xl border border-border">
      {/* Top Controls: Viewport Mode Switcher */}
      <div className="flex items-center justify-between w-full max-w-4xl pb-3 mb-4 sm:mb-6 border-b border-border/80 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-text-secondary truncate">
            حالت پیش‌نمایش:
          </span>
          <span className="text-xs text-text-muted font-numeric hidden sm:inline">
            {viewportMode === "desktop" ? "دسکتاپ (کامل)" : "موبایل"}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setViewportMode("desktop")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
              viewportMode === "desktop"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-light"
            }`}
          >
            <DesktopWindowsIcon fontSize="small" />
            <span className="hidden xs:inline">دسکتاپ</span>
          </button>

          <button
            type="button"
            onClick={() => setViewportMode("mobile")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
              viewportMode === "mobile"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-light"
            }`}
          >
            <PhoneIphoneIcon fontSize="small" />
            <span className="hidden xs:inline">موبایل</span>
          </button>
        </div>
      </div>

      {/* Article Viewport Container (adaptive: 100% on real mobile, simulated on desktop) */}
      <div
        dir="rtl"
        className={`bg-surface shadow-sm rounded-2xl transition-all duration-300 overflow-hidden border border-border/70 w-full ${
          viewportMode === "mobile"
            ? "md:w-[390px] md:max-w-[390px]"
            : "max-w-4xl"
        }`}
      >
        {/* Article Banner Image */}
        {resolvedImage ? (
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative overflow-hidden bg-bg-light border-b border-border/50 aspect-video">
            <img
              src={resolvedImage}
              alt={title || "پیش‌نمایش تصویر مقاله"}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="w-full h-36 sm:h-44 bg-bg-light flex items-center justify-center text-text-muted text-xs border-b border-border/50">
            تصویر شاخص هنوز انتخاب نشده است
          </div>
        )}

        {/* Article Content Wrapper */}
        <article className="p-4 sm:p-6 md:p-10 flex flex-col gap-5 sm:gap-6">
          {/* Tags */}
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <LocalOfferIcon fontSize="inherit" className="text-text-muted shrink-0" />
              {tags.map((tag, idx) => (
                <Badge key={idx} variant="primary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-secondary leading-snug break-words">
            {title || "عنوان مقاله در اینجا نمایش داده می‌شود"}
          </h1>

          {/* Date and Meta */}
          <div className="flex items-center gap-3 text-xs md:text-sm text-text-muted border-b border-border/70 pb-3 flex-wrap">
            <div className="flex items-center gap-1.5 shrink-0">
              <CalendarTodayIcon fontSize="inherit" className="text-primary" />
              <span className="font-numeric">{date || "تاریخ انتشار"}</span>
            </div>
            <span className="text-border">•</span>
            <span>انتشار در آکادمی رکاد</span>
          </div>

          {/* Lead / Description */}
          {description && (
            <div className="text-sm md:text-base text-text-secondary leading-relaxed bg-bg-light/60 p-3.5 sm:p-5 rounded-xl border-r-4 border-primary break-words">
              <p className="font-medium">{description}</p>
            </div>
          )}

          {/* Table of Contents (فهرست مطالب) */}
          {(() => {
            const validToc = (tableOfContents || []).filter((item) => {
              const itemTitle = typeof item === "string" ? item : item?.title;
              return Boolean(itemTitle && itemTitle.trim());
            });

            if (validToc.length === 0) return null;

            return (
              <div className="bg-primary-light/40 border border-primary-border rounded-xl p-4 sm:p-5 my-1">
                <div className="flex items-center gap-2 text-primary-active font-bold text-sm md:text-base mb-3">
                  <ListAltIcon fontSize="small" />
                  <span>فهرست مطالب مقاله</span>
                </div>
                <ul className="flex flex-col gap-2 pr-1 sm:pr-2">
                  {validToc.map((item, index) => {
                    const titleText =
                      typeof item === "string" ? item : item?.title || "";
                    return (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-xs md:text-sm text-text-primary hover:text-primary transition-colors cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center font-numeric shrink-0">
                          {toPersianNum(index + 1)}
                        </span>
                        <span className="font-medium break-words">{titleText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })()}

          {/* Rendered HTML Body */}
          {htmlContent ? (
            <>
              <style>{`
                .article-content h1, .article-content h2, .article-content h3 { font-weight: 800; color: #1e293b; margin-top: 1.25rem; margin-bottom: 0.5rem; word-break: break-word; }
                .article-content h2 { font-size: 1.35rem; line-height: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.4rem; }
                .article-content h3 { font-size: 1.15rem; line-height: 1.75rem; }
                .article-content p { line-height: 1.8; color: #334155; margin-bottom: 0.75rem; word-break: break-word; }
                .article-content ul, .article-content ol { padding-right: 1.25rem; margin-bottom: 0.75rem; list-style-type: disc; }
                .article-content li { margin-bottom: 0.35rem; word-break: break-word; }
                .article-content blockquote { border-right: 4px solid #58bdaf; padding: 0.75rem 1rem; margin: 1rem 0; color: #475569; font-style: italic; background-color: #f8fafc; border-radius: 0.5rem; }
                .article-content pre { background-color: #1e2433; color: #f1f5f9; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; font-family: monospace; font-size: 0.85rem; direction: ltr; text-align: left; max-width: 100%; }
                .article-content code { background-color: #f1f5f9; color: #0f172a; padding: 0.2rem 0.4rem; border-radius: 0.375rem; font-family: monospace; font-size: 0.85rem; word-break: break-word; }
                .article-content pre code { background-color: transparent; color: inherit; padding: 0; }
                .article-content img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1rem 0; }
                .article-content a { color: #0284c7; text-decoration: underline; word-break: break-all; }
                .article-content hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0; }
              `}</style>
              <div
                className="article-content text-text-primary text-sm md:text-base leading-relaxed flex flex-col gap-4 pt-2 border-t border-border/60 max-w-none overflow-hidden"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </>
          ) : (
            <div className="text-center py-8 text-text-muted text-xs border border-dashed border-border rounded-xl">
              محتوای متنی مقاله (HTML) هنوز وارد نشده است.
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
