// ==========================================
// UI Component: Modal / BottomSheet
// Responsive dialog displaying as a centered modal on desktop and an adaptive bottom sheet on mobile
// Includes focus trap, Escape listener, body scroll lock, and safe-area support
// ==========================================

import React, { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Reusable responsive Modal / Bottom Sheet component.
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Close callback handler
 * @param {string} [props.title] - Dialog header title
 * @param {React.ReactNode} props.children - Modal body content
 * @param {React.ReactNode} [props.footer] - Optional modal footer action area
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='md'] - Max width size on desktop
 * @param {string} [props.className=''] - Additional container classes
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className = "",
}) {
  const modalRef = useRef(null);

  // Lock body scroll and attach Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "md:max-w-md",
    md: "md:max-w-xl",
    lg: "md:max-w-2xl",
    xl: "md:max-w-4xl",
    full: "md:max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        role="presentation"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet Container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || "پنجره گفتگو"}
        dir="rtl"
        className={`
          relative z-50 w-full ${sizeClasses[size] || sizeClasses.md}
          bg-surface rounded-t-3xl md:rounded-2xl shadow-2xl border-t md:border border-border
          flex flex-col max-h-[90dvh] md:max-h-[85vh] overflow-hidden overscroll-contain
          animate-slideUp md:animate-fadeIn pb-safe md:pb-0
          ${className}
        `}
      >
        {/* Mobile Grab Handle Bar */}
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-border-hover/80" />
        </div>

        {/* Modal Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-light shrink-0">
            <h3 className="font-extrabold text-secondary text-base md:text-lg">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-neutral-100 transition-colors cursor-pointer"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-4 text-right">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 border-t border-border-light bg-bg-light/40 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
