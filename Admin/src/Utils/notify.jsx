// ==========================================
// Utility: Notification & Toast System
// Custom RTL wrapper around react-hot-toast with project design tokens & Undo flow
// ==========================================

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// ==========================================
// Toast Theme & Style Configuration
// ==========================================

const BASE_TOAST_STYLE = {
  direction: "rtl",
  fontFamily: "var(--font-sans, 'IRANSansX', 'Vazirmatn', sans-serif)",
  fontSize: "0.875rem",
  fontWeight: "500",
  lineHeight: "1.6",
  color: "var(--color-text-primary, #292827)",
  backgroundColor: "var(--color-surface, #ffffff)",
  borderRadius: "1rem",
  border: "1px solid var(--color-border, #e2e8f0)",
  boxShadow: "0 10px 25px -5px rgba(27, 35, 77, 0.08), 0 8px 10px -6px rgba(27, 35, 77, 0.04)",
  padding: "12px 18px",
  maxWidth: "460px",
};

const TOAST_VARIANTS = {
  success: {
    iconTheme: { primary: "var(--color-success, #10b981)", secondary: "var(--color-surface, #ffffff)" },
    style: { ...BASE_TOAST_STYLE, borderRight: "4px solid var(--color-success, #10b981)" },
    handler: (msg, opts) => toast.success(msg, opts),
  },
  error: {
    iconTheme: { primary: "var(--color-error, #ef4444)", secondary: "var(--color-surface, #ffffff)" },
    style: { ...BASE_TOAST_STYLE, borderRight: "4px solid var(--color-error, #ef4444)" },
    handler: (msg, opts) => toast.error(msg, opts),
  },
  warning: {
    icon: "⚠️",
    iconTheme: { primary: "var(--color-warning, #f59e0b)", secondary: "var(--color-surface, #ffffff)" },
    style: { ...BASE_TOAST_STYLE, borderRight: "4px solid var(--color-warning, #f59e0b)" },
    handler: (msg, opts) => toast(msg, opts),
  },
  info: {
    iconTheme: { primary: "var(--color-info, #3b82f6)", secondary: "var(--color-surface, #ffffff)" },
    style: { ...BASE_TOAST_STYLE, borderRight: "4px solid var(--color-info, #3b82f6)" },
    handler: (msg, opts) => toast(msg, opts),
  },
  loading: {
    iconTheme: { primary: "var(--color-primary, #52b8ab)", secondary: "var(--color-surface, #ffffff)" },
    style: { ...BASE_TOAST_STYLE, borderRight: "4px solid var(--color-primary, #52b8ab)" },
    handler: (msg, opts) => toast.loading(msg, opts),
  },
};

// ==========================================
// Component: UndoToastContent
// Live ticking countdown toast with accessible Undo action button
// ==========================================

export function UndoToastContent({ t, message, onUndo, expiresAt, entityLabel = "مورد" }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    let intervalId = null;
    const updateCountdown = () => {
      const left = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && intervalId) {
        clearInterval(intervalId);
      }
    };

    updateCountdown();
    intervalId = setInterval(updateCountdown, 250);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [expiresAt]);

  const handleUndo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Execute restore callback first to update state synchronously
      onUndo?.();
    } finally {
      // Remove toast immediately
      toast.remove(t.id);
    }
  };

  return (
    <div
      role="status"
      dir="rtl"
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-surface border border-border shadow-lg rounded-2xl p-3.5 flex items-center justify-between gap-3 pointer-events-auto select-none`}
      style={{
        direction: "rtl",
        fontFamily: "var(--font-sans, 'IRANSansX', 'Vazirmatn', sans-serif)",
        borderRight: "4px solid var(--color-warning, #f59e0b)",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <p className="text-xs md:text-sm font-medium text-text-primary truncate">
          {message}
        </p>
        <span
          className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0 font-numeric"
          aria-live="polite"
        >
          {remaining} ثانیه
        </span>
      </div>

      <button
        type="button"
        aria-label={`بازگردانی ${entityLabel}`}
        onClick={handleUndo}
        className="px-3.5 py-1.5 text-xs md:text-sm font-bold text-white bg-primary hover:bg-primary-hover active:bg-primary-active rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
      >
        بازگردانی
      </button>
    </div>
  );
}

// ==========================================
// Main Notify Function & Helper Shortcuts
// ==========================================

/**
 * Triggers a styled toast notification with RTL layout and custom branding.
 * @param {'success'|'error'|'warning'|'info'|'loading'} [type="success"] - Notification type variant
 * @param {string} [message=""] - Message content to display
 * @param {Object|string} [options={}] - Custom options or unique toast ID
 * @returns {string} Toast ID
 */
const Notify = (type = "success", message = "", options = {}) => {
  const opts = typeof options === "string" ? { id: options } : (options ?? {});
  const variant = TOAST_VARIANTS[type] ?? TOAST_VARIANTS.info;
  const id = opts.id ?? (typeof message === "string" && message ? `${type}-${message}` : undefined);

  const toastOptions = {
    duration: type === "loading" ? Infinity : 4000,
    position: "top-center",
    id,
    ...variant,
    ...opts,
    style: { ...variant.style, ...opts.style },
  };

  return (variant.handler ?? toast)(message, toastOptions);
};

/**
 * Triggers a custom undo toast with a deterministic ID and live countdown.
 * @param {Object} params
 * @param {string} params.id - Entity/Item ID or deterministic key
 * @param {string} params.message - Message to display
 * @param {string} [params.entityLabel="مورد"] - Entity label in Persian
 * @param {Function} params.onUndo - Callback invoked only when Undo button is clicked
 * @param {number} params.expiresAt - Epoch timestamp when the undo window closes
 * @returns {string} Toast ID
 */
export const NotifyUndo = ({ id, message, entityLabel = "مورد", onUndo, expiresAt }) => {
  const toastId = id ? String(id) : `undo-${Date.now()}`;

  toast.custom(
    (t) => (
      <UndoToastContent
        t={t}
        message={message}
        entityLabel={entityLabel}
        onUndo={onUndo}
        expiresAt={expiresAt}
      />
    ),
    {
      id: toastId,
      duration: Infinity,
      position: "top-center",
    }
  );

  return toastId;
};

// Convenient helper method shortcuts
Notify.success = (message, options) => Notify("success", message, options);
Notify.error = (message, options) => Notify("error", message, options);
Notify.warning = (message, options) => Notify("warning", message, options);
Notify.info = (message, options) => Notify("info", message, options);
Notify.loading = (message, options) => Notify("loading", message, options);
Notify.undo = NotifyUndo;
Notify.dismiss = (id) => toast.dismiss(id);
Notify.remove = (id) => toast.remove(id);
Notify.promise = (promise, msgs, options = {}) =>
  toast.promise(promise, msgs, { position: "top-center", ...options });

export default Notify;
