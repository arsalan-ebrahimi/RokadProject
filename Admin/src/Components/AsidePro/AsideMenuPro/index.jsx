import { useNavigate } from "react-router-dom";
import { AsideItemPro } from "./AsideItemPro";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export function AsideMenuPro({ titleMenu }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const items = [
    "خانه",
    "بلاگ",
    "پیش ثبت نام",
    "اقتخارات",
    "نظرات"
  ];

  const urls = [
    "/",
    "/blog",
    "/enrollment",
    "/award",
    "/comment"
  ];

  // Using index instead of indexOf for better reliability
  const mapItems = items.map((e, index) => (
    <AsideItemPro key={e} title={e} onClick={() => navigate(urls[index])} />
  ));

  return (
    <div className="w-full text-right">
      {/* Toggle menu button */}
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

      {/* Submenu list */}
      {open && (
        <div className="mt-1 pr-4 border-r-2 border-[#51b5a5]/30 mr-2 flex flex-col gap-1">
          {mapItems}
        </div>
      )}
    </div>
  );
}