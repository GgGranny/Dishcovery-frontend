import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* This is where nested routes will render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;