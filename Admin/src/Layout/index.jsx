// ==========================================
// Layout Component: Dashboard Shell (AppShell)
// Responsive authenticated wrapper with mobile top bar, overlay drawer, tablet collapsed mode, and desktop sidebar
// ==========================================

import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AsidePro from "../Components/AsidePro";
import { useIsMobile, useIsTablet } from "../Hooks";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

/**
 * Main dashboard layout enforcing authentication and responsive AppShell architecture.
 */
export default function Layout() {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [tabletCollapsed, setTabletCollapsed] = useState(true);

  // Automatically close mobile drawer when route changes
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (isMobile && mobileDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobile, mobileDrawerOpen]);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div dir="rtl" className="flex min-h-dvh w-full bg-background text-text-primary antialiased">
      {/* 1. Mobile Top Navigation Bar (< md) */}
      {isMobile && (
        <header className="fixed top-0 inset-x-0 h-16 z-40 bg-surface/95 backdrop-blur-md border-b border-border/80 px-4 flex items-center justify-between pt-safe shadow-2xs">
          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="باز کردن منوی ناوبری"
            aria-expanded={mobileDrawerOpen}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-text-primary hover:bg-surface-hover active:bg-neutral-100 transition-colors cursor-pointer"
          >
            <MenuIcon fontSize="medium" />
          </button>

          {/* Centered Brand Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer select-none"
          >
            <img
              src="/Logo-Type-green.png"
              alt="پنل مدیریت رکاد"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Quick Action (SEO Settings shortcut) */}
          <button
            type="button"
            onClick={() => navigate("/seo")}
            aria-label="تنظیمات سئو"
            title="تنظیمات سئو"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-text-secondary hover:text-primary hover:bg-surface-hover active:bg-neutral-100 transition-colors cursor-pointer"
          >
            <SettingsOutlinedIcon fontSize="small" />
          </button>
        </header>
      )}

      {/* 2. Sidebar Navigation (Desktop / Tablet / Mobile Drawer) */}
      <AsidePro
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        isMobile={isMobile}
        isCollapsed={isTablet && tabletCollapsed}
        onToggleCollapse={() => setTabletCollapsed((prev) => !prev)}
      />

      {/* 3. Main Dynamic Content Area */}
      <main
        className={`
          flex-1 min-w-0 min-h-dvh flex flex-col transition-all duration-300
          ${isMobile ? "pt-16 mr-0" : isTablet && tabletCollapsed ? "mr-20" : "mr-[270px]"}
        `}
      >
        <div className="w-full max-w-[1600px] mx-auto flex-grow flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}