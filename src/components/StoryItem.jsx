import { User } from "lucide-react";
import React from "react";

const StoryItem = ({ story, onClick }) => {
  const avatar = story.avatar || story.user?.profile_picture;
  const label = story.user?.name || "Story";
  return (
    <div
      className="flex flex-col items-center cursor-pointer snap-start"
      onClick={onClick}
    >
      <div
        className={`rounded-full border-2 p-1 w-16 h-16 flex items-center justify-center
      `}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={label}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <User className="w-14 h-14 text-gray-400" />
        )}
      </div>
      <span className="text-xs mt-1 opacity-80">{label}</span>
    </div>
  );
};

export default StoryItem;
