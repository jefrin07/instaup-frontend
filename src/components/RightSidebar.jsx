import React from "react";
import { assets, dummyConnectionsData } from "../assets/assets";
import { UserPlus } from "lucide-react";

const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-6 p-4 h-screen overflow-y-auto no-scrollbar sticky top-0">
      
      {/* Sponsored Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-2">Sponsored</h3>
        <img
          src={assets.sponsored_img}
          alt="sponsored"
          className="w-full h-40 object-cover rounded-lg mb-2"
        />
        <p className="text-sm text-gray-500">Learn more about this product</p>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-2">Suggested Connections</h3>
        <div className="flex flex-col gap-3">
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-2"
            >
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
              <button className="flex items-center gap-1 text-sm text-blue-500 font-semibold hover:text-blue-600">
                <UserPlus size={16} />
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Groups / Communities */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-2">Groups</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img
              src={assets.group_users}
              alt="group"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">React Developers</p>
              <p className="text-xs text-gray-500">1.2k members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={assets.group_users}
              alt="group"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">UI/UX Designers</p>
              <p className="text-xs text-gray-500">890 members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
