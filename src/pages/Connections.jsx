import React, { useState } from "react";
import {
  dummyFollowersData,
  dummyFollowingData,
  dummyPendingConnectionsData,
  dummyConnectionsData,
} from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, UserCheck, Clock } from "lucide-react";

const tabs = [
  { label: "Followers", Icon: UserPlus },
  { label: "Following", Icon: UserCheck },
  { label: "Pending", Icon: Clock },
  { label: "Connections", Icon: Users },
];

const Connections = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Followers");

  // Stats counts
  const stats = {
    Followers: dummyFollowersData.length,
    Following: dummyFollowingData.length,
    Pending: dummyPendingConnectionsData.length,
    Connections: dummyConnectionsData.length,
  };

  // Choose data based on active tab
  const getUsersForTab = () => {
    if (activeTab === "Followers") return dummyFollowersData;
    if (activeTab === "Following") return dummyFollowingData;
    if (activeTab === "Pending") return dummyPendingConnectionsData;
    if (activeTab === "Connections") return dummyConnectionsData;
    return [];
  };

  const filteredUsers = getUsersForTab();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          {" "}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>{" "}
          <p className="text-slate-600">
            {" "}
            Manage your network and discover new connections{" "}
          </p>{" "}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="rounded-2xl bg-white shadow hover:shadow-md transition p-5 text-center"
            >
              <p className="text-3xl font-bold text-indigo-600">{value}</p>
              <p className="text-slate-600 mt-1">{key}</p>
            </div>
          ))}
        </div>

        {/* Tabs with Icons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center border-b pb-2">
          {tabs.map(({ label, Icon }) => {
            const isActive = activeTab === label;
            return (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                />
                {label}
              </button>
            );
          })}
        </div>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:scale-105 flex flex-col items-center text-center"
              >
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="rounded-full size-20 mb-4 border-2 border-indigo-200"
                />
                <p className="font-semibold text-slate-800 text-lg">
                  {user.full_name}
                </p>
                <p className="text-slate-500 mb-1">@{user.username}</p>
                <p className="text-sm text-gray-600">{user.bio}</p>
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="mt-5 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 active:scale-95 transition"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center text-lg">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Connections;
