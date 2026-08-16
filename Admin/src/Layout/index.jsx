// ==========================================
// Dependencies & Libraries
// ==========================================
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// ==========================================
// Components
// ==========================================
import AsidePro from "../Components/AsidePro";

// ==========================================
// Component: Layout
// Description: Main layout wrapper protecting routes and rendering Sidebar
// ==========================================
export default function Layout() {
  // Read authentication token from Redux store instead of Context
  const token = useSelector((state) => state.auth.token);

  // If there is no token, redirect user to the login/auth page safely
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // ----------------------------------------
  // Render Component
  // ----------------------------------------
  return (
    <div dir="rtl" className="flex h-screen w-full overflow-hidden bg-gray-50">
      
      {/* Sidebar / Aside Menu */}
      {/* Note: In RTL flex containers, the first element renders on the right side */}
      <AsidePro />

      {/* Main Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto h-full">
        <Outlet />
      </main>
      
    </div>
  );
}