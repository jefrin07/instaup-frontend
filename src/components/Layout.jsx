import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";

const Layout = () => {
  const { userData } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return userData ? (
    <div className="w-full h-screen flex relative">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Toggle Button (Top Right) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sm:hidden fixed top-3 right-3 z-40 bg-white rounded-md shadow p-2"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
