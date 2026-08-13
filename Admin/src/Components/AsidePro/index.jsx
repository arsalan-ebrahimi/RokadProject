import React from "react";
import { AsideMenuPro } from "./AsideMenuPro";

// ------------------------------------------------------------------
// 1. Main Sidebar Component
// ------------------------------------------------------------------
export default function AsidePro() {
  const items = ["مدیریت"];
  
  const mapItems = items.map((e) => <AsideMenuPro key={e} titleMenu={e} />);

  return (
    <aside dir="rtl" className="shrink-0 w-[280px] h-screen sticky top-0  bg-white border-l border-gray-200 p-4 flex flex-col shadow-sm">
      
      {/* Logo Section */}
      <div className="w-full flex items-center mb-8 border-b border-gray-100 pb-4">
        <img 
          className="h-10 w-auto" 
          src="../../../public/Logo-Type-green.png" 
          alt="Rokad-logo" 
        />
      </div>

      {/* Menus Section */}
      <div className="w-full flex flex-col gap-2">
        {mapItems}
      </div>
    </aside>
  );
}