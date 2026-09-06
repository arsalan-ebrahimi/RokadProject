// ==========================================
// Utility: Notification & Toast System
// Custom RTL wrapper around react-hot-toast with project design tokens
// ==========================================

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
  maxWidth: "440px",
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

// Convenient helper method shortcuts
Notify.success = (message, options) => Notify("success", message, options);
Notify.error = (message, options) => Notify("error", message, options);
Notify.warning = (message, options) => Notify("warning", message, options);
Notify.info = (message, options) => Notify("info", message, options);
Notify.loading = (message, options) => Notify("loading", message, options);
Notify.dismiss = (id) => toast.dismiss(id);
Notify.remove = (id) => toast.remove(id);
Notify.promise = (promise, msgs, options = {}) =>
  toast.promise(promise, msgs, { position: "top-center", ...options });

export default Notify;


