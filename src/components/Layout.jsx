import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar"; // 1. Import the new Sidebar
import { useAuth } from "../context/authContext";

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={user} onLogout={logout} />

      {/* 2. This div is the main layout change */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3. The Sidebar is added here, passing the user prop */}
        <Sidebar user={user} />

        {/* 4. The main content area now scrolls independently */}
        <main className="flex-1 min-w-0 pl-16 overflow-y-auto">
          {/* Outlet renders the current matched route's component */}
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
