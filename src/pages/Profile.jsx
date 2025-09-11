import React, { useState } from "react";
import { MapPin, CalendarDays, CheckCircle2, Edit3, X } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Posts");
  const [isEditing, setIsEditing] = useState(false);

  // Profile state (editable)
  const [user, setUser] = useState({
    full_name: "John Warren",
    username: "john_warren",
    bio: "🌍 Dreamer | 📚 Learner | 🚀 Doer Exploring life one step at a time. ✨ Staying curious. Creating with purpose.",
    location: "New York, NY",
    joined: "16 days ago",
    profile_picture: "https://i.pravatar.cc/150?img=12",
    posts: 6,
    followers: 2,
    following: 2,
  });

  // Temp form state for editing
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header / Cover */}
      <div className="relative bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 h-40 rounded-b-2xl"></div>

      {/* Profile Info */}
      <div className="max-w-3xl mx-auto -mt-16 p-6">
        <div className="bg-white rounded-2xl shadow p-6 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
          </div>

          {/* Edit button */}
          <button
            onClick={() => {
              setFormData(user);
              setIsEditing(true);
            }}
            className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Edit3 className="w-4 h-4" /> Edit
          </button>

          {/* User Info */}
          <div className="mt-16">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">
                {user.full_name}
              </h2>
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-slate-500">@{user.username}</p>

            <p className="mt-2 text-slate-700">{user.bio}</p>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 mt-3 text-slate-500 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {user.location}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" /> Joined {user.joined}
              </span>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-4 font-medium text-slate-800">
              <span>{user.posts} Posts</span>
              <span>{user.followers} Followers</span>
              <span>{user.following} Following</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mt-8 border-b">
          {["Posts", "Media", "Likes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="mt-6 space-y-6">
          {activeTab === "Posts" && (
            <div className="bg-white p-5 rounded-xl shadow">
              <div className="flex gap-3">
                <img
                  src={user.profile_picture}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{user.full_name}</span>
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span className="text-slate-500 text-sm">
                      @{user.username} • 9 days ago
                    </span>
                  </div>
                  <p className="mt-1 text-slate-700">
                    We’re a small #team with a big vision — working day and night
                    to turn dreams into products, and #products into something
                    people love.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Media" && (
            <p className="text-center text-slate-500">No media yet</p>
          )}
          {activeTab === "Likes" && (
            <p className="text-center text-slate-500">No likes yet</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
            {/* Close */}
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
