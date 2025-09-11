import React, { useState } from "react";
import {
  dummyConnectionsData,
  dummyFollowersData,
  dummyFollowingData,
} from "../assets/assets";
import {
  MapPin,
  Users,
  UserPlus,
  Check,
  Search,
  MessageCircle,
} from "lucide-react";

const Discover = () => {
  const [query, setQuery] = useState("");

  // Combine sample users
  const users = [
    ...dummyConnectionsData,
    ...dummyFollowersData,
    ...dummyFollowingData,
  ];

  // Simple search filter
  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.bio.toLowerCase().includes(query.toLowerCase()) ||
      user.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover People
          </h1>
          <p className="text-slate-600">
            Connect with amazing people and grow your network
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search people by name, username, bio, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* User Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
              >
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="rounded-full size-20 mb-4 border-2 border-indigo-200"
                />
                <p className="font-semibold text-slate-800 text-lg">
                  {user.full_name}
                </p>
                <p className="text-slate-500 mb-2">@{user.username}</p>
                <p className="text-sm text-gray-600 mb-3">{user.bio}</p>

                {/* Location & Followers */}
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mb-5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {user.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-slate-400" />
                    {user.followers?.length || 0} Followers
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition">
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </button>
                  <button className="w-11 h-11 flex items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50 transition">
                    <MessageCircle className="w-5 h-5 text-slate-600" />
                  </button>
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

export default Discover;
