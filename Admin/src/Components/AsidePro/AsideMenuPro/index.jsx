// ==========================================
// Layout Component: AsideMenuPro
// Collapsible sidebar accordion section containing dashboard navigation links
// ==========================================

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AsideItemPro } from "./AsideItemPro";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/**
 * Collapsible menu section with active route detection.
 * @param {Object} props
 * @param {string} props.titleMenu - Header title of the accordion section
 */
export function AsideMenuPro({ titleMenu }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { title: "داشبورد اصلی", path: "/" },
    { title: "بلاگ‌ها", path: "/blog" },
    { title: "رویدادها", path: "/event" },
    { title: "دانش‌آموزان", path: "/student" },
    { title: "افتخارات", path: "/award" },
    { title: "نظرات", path: "/comment" },
    { title: "تنظیمات سئو", path: "/seo" },
  ];

  const isCurrentActive = (itemPath) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="w-full text-right">
      {/* Toggle Menu Header */}
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex justify-between items-center px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-surface-hover select-none group"
      >
        <span className="font-bold text-secondary text-sm md:text-[15px]">
          {titleMenu}
        </span>
        <KeyboardArrowDownIcon
          className="transition-transform duration-300 text-text-secondary group-hover:text-primary"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fontSize="small"
        />
      </div>

      {/* Submenu List */}
      {open && (
        <div className="mt-1.5 pr-3 border-r-2 border-primary/20 mr-2 flex flex-col gap-1">
          {navigationItems.map((item) => (
            <AsideItemPro
              key={item.title}
              title={item.title}
              isActive={isCurrentActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AsideMenuPro;