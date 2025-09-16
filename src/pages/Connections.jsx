import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPlus, UserCheck, Clock, User } from "lucide-react";

import {
  getConnections,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../services/connectionsService";

const tabs = [
  { label: "Followers", Icon: UserPlus },
  { label: "Following", Icon: UserCheck },
  { label: "Pending", Icon: Clock },
];

const Connections = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Followers");
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await getConnections();
      setFollowers(res.followers || []);
      setFollowing(res.following || []);
      setPending(res.pending || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch connections");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      await acceptFollowRequest(requesterId);
      toast.success("Request accepted!");
      fetchConnections();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleReject = async (requesterId) => {
    try {
      await rejectFollowRequest(requesterId);
      toast.info("Request rejected");
      fetchConnections();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request");
    }
  };

  const stats = {
    Followers: followers.length,
    Following: following.length,
    Pending: pending.length,
  };

  const getUsersForTab = () => {
    if (activeTab === "Followers") return followers;
    if (activeTab === "Following") return following;
    if (activeTab === "Pending") return pending;
    return [];
  };

  const filteredUsers = getUsersForTab();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading connections...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>
          <p className="text-slate-600">
            Manage your network and discover new connections
          </p>
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

        {/* Tabs */}
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

        {/* Users */}
        {filteredUsers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:scale-105 flex flex-col items-center text-center"
              >
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.name}
                    className="rounded-full size-20 mb-4 border-2 border-indigo-200 object-cover"
                  />
                ) : (
                  <div className="rounded-full size-20 mb-4 border-2 border-indigo-200 bg-slate-100 flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-400" />
                  </div>
                )}

                <p className="font-semibold text-slate-800 text-lg">
                  {user.name}
                </p>
                <p className="text-slate-500 mb-1">@{user.username}</p>
                <p className="text-sm text-gray-600">{user.bio}</p>

                {/* Buttons */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => navigate(`/view-profile/${user._id}`)}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 active:scale-95 transition"
                  >
                    View Profile
                  </button>

                  {activeTab === "Pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(user._id)}
                        className="px-5 py-2 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 active:scale-95 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        className="px-5 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 active:scale-95 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
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
