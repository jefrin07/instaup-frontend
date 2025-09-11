import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";

const Layout = () => {
  const { userData } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prevent background scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  if (!userData) return <Loading />;

  return (
    <div className="w-full h-screen flex relative bg-slate-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 sm:hidden z-20 transition-opacity duration-300"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen no-scrollbar">
        <Outlet />
      </main>

      {/* Sidebar toggle button for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sm:hidden fixed top-4 right-4 z-30 bg-white rounded-md shadow p-2 transition hover:bg-gray-100"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>
    </div>
  );
};

export default Layout;
