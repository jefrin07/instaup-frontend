import React from "react";
import { assets, dummyConnectionsData } from "../assets/assets";
import SuggestedConnections from "./SuggestedConnections";
import RecenMessages from "./RecenMessages";

const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-6 p-4 h-screen overflow-y-auto no-scrollbar sticky top-0">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-2">Sponsored</h3>
        <img
          src={assets.sponsored_img}
          alt="sponsored"
          className="w-full h-40 object-cover rounded-lg mb-2"
        />
        <p className="text-sm text-gray-500">Learn more about this product</p>
      </div>
      <RecenMessages />
      <SuggestedConnections />
    </div>
  );
};

export default RightSidebar;
