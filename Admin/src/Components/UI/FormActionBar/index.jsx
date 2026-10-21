// ==========================================
// UI Component: FormActionBar
// Responsive sticky bottom action bar for form submission and cancellation
// Desktop: inline bottom action bar
// Mobile: fixed/sticky above device safe-area with guaranteed tap targets and content clearance
// ==========================================

import React from "react";
import Button from "../Button";

/**
 * Responsive action bar for form submissions.
 * @param {Object} props
 * @param {string} [props.submitLabel="ثبت اطلاعات"] - Primary submit button text
 * @param {boolean} [props.isSubmitting=false] - Whether submit is in loading state
 * @param {Function} [props.onSubmit] - Optional explicit submit handler if not using type="submit"
 * @param {string} [props.cancelLabel="انصراف"] - Cancel button text
 * @param {Function} [props.onCancel] - Cancel click handler (defaults to history.back)
 * @param {React.ReactNode} [props.secondaryAction] - Custom secondary action button (e.g. Preview button)
 * @param {React.ReactNode} [props.children] - Custom children overrides
 * @param {string} [props.className=""] - Custom classes
 */
export function FormActionBar({
  submitLabel,
  submitText,
  isSubmitting = false,
  onSubmit,
  cancelLabel,
  cancelText,
  onCancel,
  showCancel = true,
  secondaryAction = null,
  children = null,
  className = "",
}) {
  const finalSubmitText = submitLabel || submitText || "ثبت اطلاعات";
  const finalCancelText = cancelLabel || cancelText || "انصراف";

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  if (children) {
    return (
      <div
        className={`
          fixed md:static bottom-0 inset-x-0 z-30 bg-surface/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none
          border-t border-border/80 p-3.5 sm:p-4 md:p-0 md:pt-6 md:mt-6 pb-safe shadow-lg md:shadow-none
          ${className}
        `}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`
        fixed md:static bottom-0 inset-x-0 z-30 bg-surface/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none
        border-t border-border/80 px-4 py-3 md:p-0 md:pt-6 md:mt-6 pb-safe shadow-lg md:shadow-none
        flex items-center justify-between md:justify-end gap-3
        ${className}
      `}
    >
      {secondaryAction ? (
        secondaryAction
      ) : showCancel ? (
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleCancel}
          className="flex-1 md:flex-initial md:min-w-[110px] text-xs md:text-sm font-semibold min-h-[44px]"
        >
          {finalCancelText}
        </Button>
      ) : null}

      <Button
        type={onSubmit ? "button" : "submit"}
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        onClick={onSubmit}
        className="flex-[2] md:flex-initial md:min-w-[140px] min-h-[44px] text-xs md:text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
      >
        {finalSubmitText}
      </Button>
    </div>
  );
}

export default FormActionBar;
