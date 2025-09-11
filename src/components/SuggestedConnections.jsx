import React from "react";
import { dummyConnectionsData } from "../assets/assets";
import { UserPlus } from "lucide-react";

const SuggestedConnections = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold mb-2">Suggested Connections</h3>
      <div className="flex flex-col gap-3">
        {dummyConnectionsData.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between gap-2"
          >
            {/* Profile Section */}
            <div className="flex items-center gap-2">
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{user.full_name}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>

            {/* Connect Button */}
            <button className="flex items-center gap-1 text-sm text-blue-500 font-semibold hover:text-blue-600">
              <UserPlus size={16} />
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedConnections;
