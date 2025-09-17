import React from "react";
import { CirclePlus, User } from "lucide-react";

const StoryItem = ({ story, isOwnStory, onClick }) => {
  return (
    <div
      className="flex flex-col items-center text-center min-w-[70px] cursor-pointer"
      onClick={onClick}
    >
      {isOwnStory ? (
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
            {story?.avatar ? (
              <img
                src={story.avatar}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-[2px]">
            <CirclePlus size={16} className="text-white" />
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-full p-[2px]">
          <div className="bg-white rounded-full p-[2px]">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
              {story.media_type === "image" && (
                <img
                  src={story.media_url}
                  alt="story"
                  className="w-full h-full object-cover"
                />
              )}
              {story.media_type === "video" && (
                <video
                  src={story.media_url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
              {story.media_type === "text" && (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-xs font-semibold text-center p-2"
                  style={{ backgroundColor: story.background_color }}
                >
                  {story.content.slice(0, 2)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <span className="text-[11px] mt-2 truncate w-16">
        {story.user?.name || "Your Story"}
      </span>
    </div>
  );
};

export default StoryItem;
