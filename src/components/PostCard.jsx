import React from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const { user, content, image_urls, post_type, likes_count, createdAt } = post;
  const navigate = useNavigate();
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const formatContent = (text) => {
    return text.split(/(\#[a-zA-Z0-9_]+)/g).map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span
            key={index}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white shadow rounded-2xl mb-6 overflow-hidden border border-gray-200">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        <img
          src={user?.avatar || "https://via.placeholder.com/40"}
          alt={user?.name}
          className="w-10 h-10 rounded-full border"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{user?.name || "Unknown"}</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
      </div>

      {/* Content */}
      {content && (
        <div className="px-4 pb-3 text-gray-800 text-sm">
          {formatContent(content)}
        </div>
      )}

      {/* Image */}
      {post_type !== "text" && image_urls.length > 0 && (
        <div className="w-full">
          <img
            src={image_urls[0]}
            alt="post"
            className="w-full object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-4 text-gray-700">
          <button className="hover:text-red-500">
            <Heart size={22} />
          </button>
          <button className="hover:text-blue-500">
            <MessageCircle size={22} />
          </button>
          <button className="hover:text-green-500">
            <Send size={22} />
          </button>
        </div>
        <span className="text-sm text-gray-600">
          {likes_count.length} likes
        </span>
      </div>
    </div>
  );
};

export default PostCard;
