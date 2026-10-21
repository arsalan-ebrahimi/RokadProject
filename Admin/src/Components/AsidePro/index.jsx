// ==========================================
// Layout Component: AsidePro (Sidebar Container)
// Responsive navigation sidebar supporting desktop sticky, tablet collapsed, and mobile overlay drawer
// ==========================================

import React, { useEffect, useRef } from "react";
import { AsideMenuPro } from "./AsideMenuPro";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Store/Slices/authSlice";

/**
 * Sidebar navigation container component.
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Whether mobile drawer is open
 * @param {Function} [props.onClose] - Close handler for mobile drawer
 * @param {boolean} [props.isMobile=false] - Whether currently in mobile breakpoint
 * @param {boolean} [props.isCollapsed=false] - Whether sidebar is in collapsed icon-mode (e.g. on tablet)
 * @param {Function} [props.onToggleCollapse] - Callback to toggle tablet collapse state
 */
export default function AsidePro({
  isOpen = false,
  onClose,
  isMobile = false,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const items = ["مدیریت"];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Focus trap and Escape listener for mobile drawer
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, isOpen, onClose]);

  const handleLogout = () => {
    dispatch(logout());
    onClose?.();
    navigate("/auth");
  };

  // 1. Mobile Overlay Drawer Mode (< md)
  if (isMobile) {
    return (
      <>
        {/* Backdrop overlay */}
        <div
          role="presentation"
          onClick={onClose}
          className={`
            fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300
            ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          aria-hidden={!isOpen}
        />

        {/* Drawer container */}
        <aside
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="منوی ناوبری پنل مدیریت"
          dir="rtl"
          className={`
            fixed top-0 right-0 bottom-0 z-50 w-[280px] max-w-[85vw] h-dvh bg-surface border-l border-border
            p-4 pt-safe pb-safe flex flex-col shadow-2xl overflow-y-auto hide-scrollbar overscroll-contain
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Mobile Drawer Header: Logo + Close Button */}
          <div className="w-full flex items-center justify-between mb-4 border-b border-border-light pb-3 px-1">
            <img
              className="h-8 w-auto object-contain"
              src="/Logo-Type-green.png"
              alt="لوگو رکاد"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن منو"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-neutral-100 transition-colors cursor-pointer"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          {/* Menus Section */}
          <div className="w-full flex-grow flex flex-col gap-2">
            {items.map((e) => (
              <AsideMenuPro
                key={e}
                titleMenu={e}
                onItemClick={onClose}
              />
            ))}
          </div>

          {/* Bottom Logout Button */}
          <div className="pt-4 border-t border-border-light mt-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-error hover:bg-error-light active:bg-error-border/30 transition-colors font-bold text-xs cursor-pointer min-h-[44px]"
            >
              <span className="flex items-center gap-2">
                <LogoutIcon fontSize="small" className="rotate-180" />
                <span>خروج از حساب</span>
              </span>
            </button>
          </div>
        </aside>
      </>
    );
  }

  // 2. Desktop and Tablet Mode (md+)
  return (
    <aside
      dir="rtl"
      aria-label="منوی ناوبری اصلی"
      className={`
        fixed top-0 right-0 h-dvh bg-surface border-l border-border/80 flex flex-col shadow-xs z-30 overflow-y-auto hide-scrollbar transition-all duration-300
        ${isCollapsed ? "w-20 p-2.5 items-center" : "w-[270px] p-4"}
      `}
    >
      {/* Header / Brand Logo + Tablet collapse toggle */}
      <div className={`w-full flex items-center mb-6 border-b border-border-light pb-4 ${isCollapsed ? "justify-center px-0" : "justify-between px-2"}`}>
        {!isCollapsed && (
          <img
            className="h-9 w-auto object-contain"
            src="/Logo-Type-green.png"
            alt="Rokad-logo"
          />
        )}

        {isCollapsed && (
          <img
            className="h-8 w-8 object-contain"
            src="/vite.svg"
            alt="Rokad"
          />
        )}

        {/* Tablet / Desktop Collapse Toggle Button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "گسترش منو" : "جمع کردن منو"}
            title={isCollapsed ? "گسترش منو" : "جمع کردن منو"}
            className="hidden md:flex lg:hidden items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-light transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronLeftIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </button>
        )}
      </div>

      {/* Menus Section */}
      <div className="w-full flex-grow flex flex-col gap-2">
        {items.map((e) => (
          <AsideMenuPro
            key={e}
            titleMenu={e}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Footer Area */}
      {!isCollapsed && (
        <div className="pt-4 border-t border-border-light mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-text-muted hover:text-error hover:bg-error-light/60 transition-colors font-medium text-xs cursor-pointer min-h-[40px]"
          >
            <LogoutIcon fontSize="small" className="rotate-180" />
            <span>خروج از پنل</span>
          </button>
        </div>
      )}
    </aside>
  );
}