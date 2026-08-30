import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AsidePro from "../Components/AsidePro";

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