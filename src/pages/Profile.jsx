import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { User, Mail, Lock } from "lucide-react";

const Profile = () => {
  const { userData } = useAppContext();
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        My Profile
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-6 border-b mb-8">
        {["details", "edit", "password"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-3 text-sm md:text-base relative transition font-medium
              ${
                activeTab === tab
                  ? "text-indigo-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab === "details"
              ? "User Details"
              : tab === "edit"
              ? "Edit Profile"
              : "Change Password"}
          </button>
        ))}
      </div>

      {/* Card Content */}
      <div className="bg-white shadow-xl rounded-2xl p-8 transition-all duration-300">
        {/* User Details */}
        {activeTab === "details" && (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border-4 border-indigo-100 flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-indigo-200">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-indigo-500" />
              )}
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-800">
                {userData?.name}
              </h2>
              <p className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-indigo-500" /> {userData?.email}
              </p>
              {userData?.bio && (
                <p className="text-gray-500 text-sm mt-2 italic">
                  “{userData.bio}”
                </p>
              )}
            </div>
          </div>
        )}

        {/* Edit Profile */}
        {activeTab === "edit" && (
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={userData?.name}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                rows={3}
                defaultValue={userData?.bio}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Change Password */}
        {activeTab === "password" && (
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-medium shadow hover:bg-red-600 transition"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
