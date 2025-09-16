import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserById } from "../services/userProfile";
import {
  unfollowUser,
  cancelFollowRequest,
  followUser,
} from "../services/userService";

const OtherUserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserById(id);
        setUserData(res.user);
        setIsFollowing(res.user?.isFollowing || false);
        setRequestSent(res.user?.requestSent || false);
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleFollow = async () => {
    try {
      await followUser(id);

      if (userData.isPrivate) {
        // Private account → request sent
        setRequestSent(true);
        toast.success("Follow request sent!");
      } else {
        // Public account → instantly followed
        setIsFollowing(true);
        setUserData((prev) => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1, // ✅ increment
        }));
        toast.success("Followed successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to follow");
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(id);
      setIsFollowing(false);

      setUserData((prev) => ({
        ...prev,
        followersCount: Math.max((prev.followersCount || 1) - 1, 0), // ✅ decrement safely
      }));

      toast.success("Unfollowed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to unfollow");
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelFollowRequest(id);
      setRequestSent(false);
      toast.success("Follow request canceled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover */}
      <div className="w-full h-48 bg-slate-200 relative">
        {userData.cover_picture && (
          <img
            src={userData.cover_picture}
            alt="cover"
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute -bottom-16 left-6">
          {userData.profile_picture ? (
            <img
              src={userData.profile_picture}
              alt={userData.username}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-400 text-3xl font-bold">
              {userData?.username ? userData.username[0].toUpperCase() : "U"}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="max-w-3xl mx-auto mt-20 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {userData.name}
            </h2>
            <p className="text-slate-500">@{userData.username}</p>
            <p className="mt-2 text-slate-700">{userData.bio}</p>
          </div>

          {/* Follow Button */}
          <div>
            {isFollowing ? (
              <button
                onClick={handleUnfollow}
                className="px-5 py-2 rounded-full bg-slate-200 text-slate-800 font-medium hover:bg-slate-300"
              >
                Unfollow
              </button>
            ) : requestSent ? (
              <button
                onClick={handleCancelRequest}
                className="px-5 py-2 rounded-full bg-yellow-500 text-white font-medium hover:bg-yellow-600"
              >
                Cancel Request
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700"
              >
                Follow
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 font-medium text-slate-800">
          <span>{userData.posts?.length || 0} Posts</span>
          <span>{userData.followersCount || 0} Followers</span>
          <span>{userData.followingCount || 0} Following</span>
        </div>

        {/* Private profile notice */}
        {userData.isPrivate && !isFollowing && (
          <div className="mt-12 text-center text-slate-500">
            <p className="text-lg">This account is private</p>
            <p className="text-sm">Follow to see their posts</p>
          </div>
        )}

        {/* Posts Grid */}
        {!userData.isPrivate || isFollowing ? (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Posts</h3>
            {userData.posts?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {userData.posts.map((post) => (
                  <img
                    key={post._id}
                    src={post.image}
                    alt="post"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center">No posts yet</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OtherUserProfile;
