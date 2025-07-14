import React from 'react';
import Header from "../components/admin/Header";
import Sidebar from "../components/admin/Sidebar";
import Footer from "../components/admin/Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col"> {/* ml-64 để tránh chồng lấp với sidebar (width 256px) */}
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 m-7 rounded-lg bg-white shadow-lg p-6">
          <Outlet /> {/* Nội dung của từng trang sẽ được hiển thị ở đây */}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;