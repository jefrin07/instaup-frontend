import React, { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { getCurrentUser } from "../services/authService";
import {
  toggleLikePost,
  addComment,
  deleteComment,
} from "../services/postService";

const PostCard = ({ post, onEditPost, onDeletePost }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const lastTapRef = useRef(0);
  const menuRef = useRef(null);

  const isLiked = likes.some((id) => id.toString() === currentUserId);

  // 🖤 Like handler
  const handleLike = async () => {
    try {
      const res = await toggleLikePost(post._id);
      setLikes(res.post.likes);
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  // ❤️ Double tap
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!isLiked) handleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
    lastTapRef.current = now;
  };

  // ✍️ Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await addComment(post._id, commentText);
      setComments(res.comments);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // 🗑 Delete comment
  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;
    try {
      const res = await deleteComment(post._id, commentId);
      setComments(res.comments);
      toast.success("Comment deleted successfully!");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment. Try again.");
    }
  };

  // 👤 Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        setCurrentUserId(res.user._id);
      } catch (err) {
        console.error("Failed to get current user:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  const isCurrentUserPost = currentUserId === post.user._id;

  // 🔒 Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👆 Swipeable images
  const handleSwipe = ({ deltaX, velocity }) => {
    const threshold = 0.3;
    const distanceThreshold = 50;
    if (deltaX > distanceThreshold && velocity > threshold) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else if (deltaX < -distanceThreshold && velocity > threshold) {
      setCurrentIndex((prev) => Math.min(prev + 1, post.image_urls.length - 1));
    }
  };

  const handlers = useSwipeable({
    onSwiped: handleSwipe,
    trackMouse: true,
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
  });

  // 🔗 Navigate helper
  const navigateToProfile = (userId) => {
    if (userId === currentUserId) {
      navigate("/profile");
    } else {
      navigate(`/view-profile/${userId}`);
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl mb-6 overflow-hidden border border-gray-200 relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 relative">
        <img
          src={post.user?.profile_picture || "https://via.placeholder.com/40"}
          alt={post.user?.name}
          className="w-10 h-10 rounded-full border object-cover cursor-pointer"
          onClick={() => navigateToProfile(post.user._id)}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()} // 🚫 disable right-click menu
        />
        <div className="flex flex-col">
          <span
            className="font-semibold cursor-pointer"
            onClick={() => navigateToProfile(post.user._id)}
          >
            {post.user?.name || "Unknown"}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3 text-gray-800 text-sm">{post.content}</div>
      )}

      {/* Swipeable Images */}
      {post.post_type !== "text" && post.image_urls?.length > 0 && (
        <div
          className="relative w-full overflow-hidden"
          {...handlers}
          onClick={handleDoubleTap}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {post.image_urls.map((img, idx) => (
              <img
                key={idx}
                src={img.url || img}
                alt={`post-${idx}`}
                className="w-full max-h-[500px] object-cover flex-shrink-0"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()} // 🚫 disable right-click menu
              />
            ))}
          </div>

          {/* ❤️ Overlay */}
          <AnimatePresence>
            {showHeart && (
              <motion.div
                key="heart"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart className="w-28 h-28 text-red-500 fill-red-500 drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Counter */}
          {post.image_urls.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
              {currentIndex + 1}/{post.image_urls.length}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-4 text-gray-700">
          <button
            onClick={handleLike}
            className="hover:text-red-500 flex items-center gap-1"
          >
            <Heart
              size={22}
              className={`${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span className="text-sm">{likes.length}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-blue-500 flex items-center gap-1"
          >
            <MessageCircle size={22} />
            <span className="text-sm">{comments.length}</span>
          </button>
          <button className="hover:text-green-500">
            <Send size={22} />
          </button>
        </div>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t flex flex-col max-h-80"
          >
            <div className="flex justify-between items-center px-4 py-3 border-b bg-slate-50 sticky top-0 z-10">
              <p className="text-sm font-semibold text-slate-700">Comments</p>
              <X
                className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700"
                onClick={() => setShowComments(false)}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {comments.length > 0 ? (
                comments.map((c, idx) => {
                  const isCommentOwner = c.user?._id === currentUserId;
                  const isPostOwner = post.user._id === currentUserId;
                  const canDelete = isCommentOwner || isPostOwner;

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 group relative"
                    >
                      <img
                        src={
                          c.user?.profile_picture ||
                          "https://via.placeholder.com/32"
                        }
                        alt={c.user?.name}
                        className="w-8 h-8 rounded-full object-cover cursor-pointer"
                        onClick={() => navigateToProfile(c.user?._id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span
                            className="font-semibold text-slate-800 cursor-pointer"
                            onClick={() => navigateToProfile(c.user?._id)}
                          >
                            {c.user?.name || "User"}
                          </span>{" "}
                          <span className="text-slate-700">{c.text}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(c.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="absolute top-0 right-0 text-red-500 text-xs hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 text-center">
                  No comments yet
                </p>
              )}
            </div>
            <form
              onSubmit={handleAddComment}
              className="flex items-center gap-2 border-t px-4 py-3 bg-white sticky bottom-0"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition"
              >
                Post
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
