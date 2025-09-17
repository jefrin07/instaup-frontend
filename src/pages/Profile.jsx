import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import CoverImage from "../components/Profile/CoverImage";
import AvatarImage from "../components/Profile/AvatarImage";
import ProfileInfo from "../components/Profile/ProfileInfo";
import Tabs from "../components/Profile/Tabs";
import EditProfileModal from "../components/Profile/EditProfileModal";
import UserPosts from "../components/Profile/UserPosts";

import { updateProfile } from "../services/userProfile";
import { getCurrentUser } from "../services/authService";
import { getUserPosts } from "../services/postService";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Posts");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [previewProfile, setPreviewProfile] = useState("");
  const [previewCover, setPreviewCover] = useState("");

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser();
        setUserData(res.user);
        setFormData(res.user);
        setPreviewProfile(res.user?.profile_picture || "");
        setPreviewCover(res.user?.cover_picture || "");
        localStorage.setItem("userData", JSON.stringify(res.user));
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch posts when "Posts" tab is active
  useEffect(() => {
    if (activeTab === "Posts" && userData) {
      const fetchPosts = async () => {
        try {
          setPostsLoading(true);
          const res = await getUserPosts(userData._id);
          setPosts(res.posts);
        } catch (err) {
          console.error("Failed to load posts:", err);
          toast.error("Failed to load posts");
        } finally {
          setPostsLoading(false);
        }
      };
      fetchPosts();
    }
  }, [activeTab, userData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});
      const updated = await updateProfile(formData);
      setUserData(updated.user);
      setFormData(updated.user);
      setPreviewProfile(updated.user?.profile_picture || "");
      setPreviewCover(updated.user?.cover_picture || "");
      localStorage.setItem("userData", JSON.stringify(updated.user));
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Profile update failed:", err);
      if (Array.isArray(err.response?.data?.errors)) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.path] = e.msg;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(err.response?.data?.message || "Update failed");
      }
    } finally {
      setSaving(false);
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
        <p className="text-slate-500">No profile data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CoverImage
        previewCover={previewCover}
        setPreviewCover={setPreviewCover}
      />

      <div className="max-w-3xl mx-auto -mt-16 p-6">
        <div className="bg-white rounded-2xl shadow p-6 relative">
          <AvatarImage
            previewProfile={previewProfile}
            setPreviewProfile={setPreviewProfile}
          />
          <ProfileInfo
            userData={userData}
            onEdit={() => {
              setFormData(userData);
              setErrors({});
              setIsEditing(true);
            }}
          />
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "Posts" && (
            <UserPosts posts={posts} loading={postsLoading} />
          )}

          {activeTab === "Stories" && (
            <div className="p-6 bg-white rounded-xl shadow text-center text-slate-500">
              Stories will appear here
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
};

export default Profile;
