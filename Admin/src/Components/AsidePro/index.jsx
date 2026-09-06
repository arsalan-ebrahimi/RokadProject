// ==========================================
// Layout Component: AsidePro (Sidebar Container)
// Sticky sidebar hosting the admin brand logo and collapsible menu sections
// ==========================================

import React from "react";
import { AsideMenuPro } from "./AsideMenuPro";

/**
 * Sidebar navigation container component.
 */
export default function AsidePro() {
  const items = ["مدیریت"];

  return (
    <aside
      dir="rtl"
      className="shrink-0 w-[260px] md:w-[270px] h-screen sticky top-0 bg-surface border-l border-border/80 p-4 flex flex-col shadow-xs z-50 overflow-y-auto hide-scrollbar"
    >
      {/* Logo Section */}
      <div className="w-full flex items-center mb-6 border-b border-border-light pb-4 px-2">
        <img
          className="h-9 w-auto object-contain"
          src="/Logo-Type-green.png"
          alt="Rokad-logo"
        />
      </div>

      {/* Menus Section */}
      <div className="w-full flex flex-col gap-2">
        {items.map((e) => (
          <AsideMenuPro key={e} titleMenu={e} />
        ))}
      </div>
    </aside>
  );
}