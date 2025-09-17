import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Heart, MessageCircle } from "lucide-react";

const UserPosts = ({ posts, loading }) => {
  if (loading) return <p className="text-slate-500 text-center mt-4">Loading posts...</p>;
  if (!posts || posts.length === 0) return <p className="text-slate-500 text-center mt-4">No posts yet</p>;

  return (
    <div className="flex flex-col gap-6 mt-4">
      {posts.map((post) => (
        <InstagramPost key={post._id} post={post} />
      ))}
    </div>
  );
};

const InstagramPost = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = ({ deltaX, velocity }) => {
    const threshold = 0.3; // Minimum velocity to trigger swipe
    const distanceThreshold = 50; // Minimum swipe distance in px

    if (deltaX > distanceThreshold && velocity > threshold) {
      // Swipe right -> previous image
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else if (deltaX < -distanceThreshold && velocity > threshold) {
      // Swipe left -> next image
      setCurrentIndex((prev) => Math.min(prev + 1, post.image_urls.length - 1));
    }
  };

  const handlers = useSwipeable({
    onSwiped: handleSwipe,
    trackMouse: true,
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {post.user.profile_picture ? (
          <img src={post.user.profile_picture} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-500 font-bold">{post.user.name?.charAt(0) || "U"}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-800">{post.user.name}</p>
          <p className="text-sm text-slate-500">@{post.user.username}</p>
        </div>
      </div>

      {/* Content */}
      {post.content && <p className="px-4 pb-2 text-slate-800">{post.content}</p>}

      {/* Swipeable Images */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="relative w-full overflow-hidden" {...handlers}>
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {post.image_urls.map((url, idx) => (
              <img key={idx} src={url} alt={`post-${idx}`} className="w-full h-96 object-cover flex-shrink-0" />
            ))}
          </div>

          {/* Top-right counter */}
          {post.image_urls.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
              {currentIndex + 1}/{post.image_urls.length}
            </div>
          )}

          {/* Bottom dots */}
          {post.image_urls.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {post.image_urls.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    idx === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-2">
        <button className="flex items-center gap-1 text-slate-600 hover:text-red-500 transition">
          <Heart className="w-5 h-5" />
          <span>{post.likes || 0}</span>
        </button>
        <button className="flex items-center gap-1 text-slate-600 hover:text-blue-500 transition">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments || 0}</span>
        </button>
      </div>

      {/* Timestamp */}
      <p className="text-xs text-slate-400 px-4 pb-4">{new Date(post.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default UserPosts;
