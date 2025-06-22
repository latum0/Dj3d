import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // whatever your sidebar/nav is

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
