import React from "react";
import { User, Plus } from "lucide-react";

const AddStory = ({ story, onClick }) => {
  const avatar = story.avatar || story.user?.profile_picture;
  const label = story.user?.name || "Story";

  return (
    <div
      className="flex flex-col items-center cursor-pointer snap-start"
      onClick={onClick}
    >
      <div className="relative rounded-full p-1 w-16 h-16 flex items-center justify-center">
        {avatar ? (
          <img
            src={avatar}
            alt={label}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <User className="w-14 h-14 text-gray-400" />
        )}
        {/* Plus icon overlay */}
        <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
          <Plus className="w-4 h-4 text-white" />
        </div>
      </div>
      <span className="text-xs mt-1 opacity-80">{label}</span>
    </div>
  );
};

export default AddStory;
