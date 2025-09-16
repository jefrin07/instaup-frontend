import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import CoverImage from "../components/Profile/CoverImage";
import AvatarImage from "../components/Profile/AvatarImage";
import ProfileInfo from "../components/Profile/ProfileInfo";
import Tabs from "../components/Profile/Tabs";
import EditProfileModal from "../components/Profile/EditProfileModal";

import { updateProfile } from "../services/userProfile"; // ⬅️ call API directly
import { getCurrentUser } from "../services/authService";

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

  // ✅ fetch user from API on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser(); // API call
        setUserData(res.user);
        setFormData(res.user);
        setPreviewProfile(res.user?.profile_picture || res.user?.avatar || "");
        setPreviewCover(res.user?.cover_picture || "");
        localStorage.setItem("userData", JSON.stringify(res.user)); // optional
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({}); // clear old errors
      const updated = await updateProfile(formData);

      setUserData(updated.user);
      setFormData(updated.user);
      setPreviewProfile(
        updated.user?.profile_picture || updated.user?.avatar || ""
      );
      setPreviewCover(updated.user?.cover_picture || "");
      localStorage.setItem("userData", JSON.stringify(updated.user));

      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Profile update failed:", err);

      // ✅ check for validation error array from backend
      if (Array.isArray(err.response?.data?.errors)) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.path] = e.msg; // map field -> message
        });
        setErrors(fieldErrors); // put into state
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
    <div className="minh-screen bg-slate-50">
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
