// ==========================================
// Layout Component: Dashboard Shell
// Main authenticated app wrapper with sidebar navigation and protected route guard
// ==========================================

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AsidePro from "../Components/AsidePro";

/**
 * Main dashboard layout that enforces authentication check and wraps page outlets.
 */
export default function Layout() {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div dir="rtl" className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar / Aside Menu */}
      <AsidePro />

      {/* Main Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto h-full">
        <Outlet />
      </main>
    </div>
  );
}