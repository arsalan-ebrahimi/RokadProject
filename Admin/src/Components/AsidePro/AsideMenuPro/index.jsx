// ==========================================
// Dependencies & Icons
// ==========================================

import { useNavigate } from "react-router-dom";
import { AsideItemPro } from "./AsideItemPro";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// ==========================================
// Sidebar Menu Dropdown (AsideMenuPro)
// ==========================================
export function AsideMenuPro({ titleMenu }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Updated Navigation Items
  const items = [
    "داشبورد اصلی",
    "بلاگ‌ها",
    "رویدادها",
    "دانش‌آموزان",
    "افتخارات",
    "نظرات"
  ];

  // Updated Navigation URLs
  const urls = [
    "/",
    "/blog",
    "/event",
    "/student",
    "/award",
    "/comment"
  ];

  const mapItems = items.map((title, index) => (
    <AsideItemPro key={title} title={title} onClick={() => navigate(urls[index])} />
  ));

  return (
    <div className="w-full text-right">
      {/* Toggle Menu Button */}
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex justify-between items-center px-3 py-3 rounded-lg transition-colors hover:bg-gray-50"
      >
        <span className="font-semibold text-[#1b234d] text-[16px]">
          {titleMenu}
        </span>
        <KeyboardArrowDownIcon
          className="transition-transform duration-300 text-[#51b5a5]"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {/* Submenu List */}
      {open && (
        <div className="mt-1 pr-4 border-r-2 border-[#51b5a5]/30 mr-2 flex flex-col gap-1">
          {mapItems}
        </div>
      )}
    </div>
  );
}