// ==========================================
// Layout Component: AsideMenuPro
// Collapsible sidebar accordion section containing dashboard navigation links with icons and collapsed mode support
// ==========================================

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AsideItemPro } from "./AsideItemPro";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

/**
 * Collapsible menu section with active route detection and responsive collapse.
 * @param {Object} props
 * @param {string} props.titleMenu - Header title of the accordion section
 * @param {boolean} [props.isCollapsed=false] - Whether menu is rendered in icon-only collapsed state
 * @param {Function} [props.onItemClick] - Callback invoked when a navigation link is clicked
 */
export function AsideMenuPro({ titleMenu, isCollapsed = false, onItemClick }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      title: "داشبورد اصلی",
      path: "/",
      icon: <DashboardOutlinedIcon fontSize="small" />,
    },
    {
      title: "بلاگ‌ها",
      path: "/blog",
      icon: <ArticleOutlinedIcon fontSize="small" />,
    },
    {
      title: "رویدادها",
      path: "/event",
      icon: <EventOutlinedIcon fontSize="small" />,
    },
    {
      title: "دانش‌آموزان",
      path: "/student",
      icon: <PeopleOutlinedIcon fontSize="small" />,
    },
    {
      title: "افتخارات",
      path: "/award",
      icon: <EmojiEventsOutlinedIcon fontSize="small" />,
    },
    {
      title: "نظرات",
      path: "/comment",
      icon: <CommentOutlinedIcon fontSize="small" />,
    },
    {
      title: "تنظیمات سئو",
      path: "/seo",
      icon: <SettingsOutlinedIcon fontSize="small" />,
    },
  ];

  const isCurrentActive = (itemPath) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(itemPath);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-full flex flex-col gap-1.5 items-center">
        {navigationItems.map((item) => (
          <AsideItemPro
            key={item.title}
            title={item.title}
            icon={item.icon}
            isActive={isCurrentActive(item.path)}
            isCollapsed={true}
            onClick={() => handleNavigate(item.path)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full text-right">
      {/* Toggle Menu Header */}
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex justify-between items-center px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-surface-hover select-none group min-h-[44px]"
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
              icon={item.icon}
              isActive={isCurrentActive(item.path)}
              onClick={() => handleNavigate(item.path)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AsideMenuPro;