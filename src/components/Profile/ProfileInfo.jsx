import React, { useState } from "react";
import {
  CheckCircle2,
  MapPin,
  CalendarDays,
  Edit3,
  Lock,
  Globe,
} from "lucide-react";
import { toast } from "react-toastify";
import { toggleAccountType } from "../../services/userProfile";

const ProfileInfo = ({ userData, onEdit }) => {
  const [accountType, setAccountType] = useState(userData?.isPrivate);
  const [updating, setUpdating] = useState(false);

  const handleToggle = async () => {
    try {
      setUpdating(true);
      const res = await toggleAccountType();
      setAccountType(res.user.isPrivate);
      toast.success(
        `Account is now ${res.user.isPrivate ? "Private" : "Public"}`
      );
      localStorage.setItem("userData", JSON.stringify(res.user));
    } catch (err) {
      console.error("Toggle failed:", err);
      toast.error("Failed to change account type");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {/* Edit + Toggle buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Edit3 className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={handleToggle}
          disabled={updating}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border ${
            accountType
              ? "border-rose-500 text-rose-600 hover:bg-rose-50"
              : "border-green-500 text-green-600 hover:bg-green-50"
          }`}
        >
          {accountType ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          {updating
            ? "Updating..."
            : accountType
            ? "Set Public"
            : "Set Private"}
        </button>
      </div>

      {/* Profile info */}
      <div className="mt-16">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-slate-900">
            {userData?.name}
          </h2>
          <CheckCircle2 className="w-5 h-5 text-indigo-500" />

          {/* Badge for current type */}
          <span
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
              accountType
                ? "bg-rose-100 text-rose-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {accountType ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Globe className="w-3 h-3" />
            )}
            {accountType ? "Private" : "Public"}
          </span>
        </div>
        <p className="text-slate-500">@{userData?.username}</p>
        <p className="mt-2 text-slate-700">{userData?.bio}</p>

        <div className="flex flex-wrap gap-4 mt-3 text-slate-500 text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {userData?.location || "Location not set"}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            Joined{" "}
            {userData?.createdAt
              ? new Date(userData.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        <div className="flex gap-6 mt-4 font-medium text-slate-800">
          <span>{userData?.posts || 0} Posts</span>
          <span>{userData?.followers?.length || 0} Followers</span>
          <span>{userData?.following?.length || 0} Following</span>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
