import React, { useState, useEffect } from "react";
import {
  followUser as followUserService,
  unfollowUser as unfollowUserService,
  cancelFollowRequest as cancelFollowRequestService,
  discoverUsers as fetchDiscoverUsers,
} from "../services/userService.js";
import { MapPin, Users, UserPlus, Check, Search, User } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext.jsx";

const Discover = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9; // users per page

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchDiscoverUsers({ input: query, page, limit });
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Fetch users whenever query or page changes
  useEffect(() => {
    fetchUsers();
  }, [query, page]);

  // Follow user
  const handleFollow = async (user) => {
    try {
      const res = await followUserService(user._id);
      toast.success(res.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to follow user");
    }
  };

  // Unfollow user
  const handleUnfollow = async (user) => {
    try {
      const res = await unfollowUserService(user._id);
      toast.info(res.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to unfollow user");
    }
  };

  // Cancel follow request
  const handleCancelRequest = async (user) => {
    try {
      const res = await cancelFollowRequestService(user._id);
      toast.info(res.message || "Follow request canceled");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to cancel request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Users */}
        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : users.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
                >
                  {user.profile_picture || user.avatar ? (
                    <img
                      src={user.profile_picture || user.avatar}
                      alt={user.name}
                      className="rounded-full w-20 h-20 mb-4 border-2 border-indigo-200 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full border-2 border-indigo-200 bg-gray-100">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}

                  <p className="font-semibold text-slate-800 text-lg">
                    {user.name}
                  </p>
                  <p className="text-slate-500 mb-2">@{user.username}</p>

                  <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mb-5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {user.location || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      {user.followersCount || 0} Followers
                    </span>
                  </div>

                  {/* Follow / Requested / Following / Follow Back */}
                  {user.isFollowing ? (
                    <button
                      onClick={() => handleUnfollow(user)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gray-300 text-gray-700 font-medium hover:opacity-90 transition"
                    >
                      <Check className="w-4 h-4" />
                      Following
                    </button>
                  ) : user.requestSent ? (
                    <button
                      onClick={() => handleCancelRequest(user)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-yellow-400 text-white font-medium hover:opacity-90 transition"
                    >
                      Cancel Request
                    </button>
                  ) : user.followingYou ? (
                    <button
                      onClick={() => handleFollow(user)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium hover:opacity-90 transition"
                    >
                      Follow Back
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(user)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-slate-500 text-center text-lg">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Discover;
