import React, { useState, useEffect } from "react";
import { User, CirclePlus, LogOut as LogOutIcon } from "lucide-react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { useAppContext } from "../context/AppContext";
import LogoutModal from "./LogoutModal";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { userData, logoutUser } = useAppContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showLogoutModal ? "hidden" : "auto";
  }, [showLogoutModal]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed sm:static top-0 left-0 h-screen w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center transform transition-transform duration-300 ease-in-out z-30
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >
        <div className="w-full flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {/* Logo */}
          <img
            onClick={() => {
              navigate("/feed");
              setSidebarOpen(false);
            }}
            src={assets.logo}
            className="w-20 ml-7 my-4 cursor-pointer"
            alt="Logo"
          />
          <hr className="border-gray-300 mb-8" />

          {/* Menu Items */}
          <MenuItems setSidebarOpen={setSidebarOpen} />

          {/* Create Post */}
          <Link
            to="/create-post"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
          >
            <CirclePlus className="w-5 h-5" />
            Create Post
          </Link>
        </div>

        {/* User Info + Logout */}
        <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
          <div className="flex gap-2 items-center cursor-pointer">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <h1 className="text-sm font-medium">{userData?.name || "Guest"}</h1>
            </div>
          </div>
          <LogOutIcon
            onClick={() => setShowLogoutModal(true)}
            className="w-5 h-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          />
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logoutUser}
      />
    </>
  );
};

export default Sidebar;
