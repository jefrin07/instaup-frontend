import React, { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { getCurrentUser } from "../../services/authService";
import {
  toggleLikePost,
  addComment,
  deleteComment,
} from "../../services/postService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const UserPosts = ({ posts, loading, onEditPost, onDeletePost }) => {
  if (loading)
    return <p className="text-slate-500 text-center mt-4">Loading posts...</p>;
  if (!posts || posts.length === 0)
    return <p className="text-slate-500 text-center mt-4">No posts yet</p>;

  return (
    <div className="flex flex-col gap-6 mt-4">
      {posts.map((post) => (
        <InstagramPost
          key={post._id}
          post={post}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
        />
      ))}
    </div>
  );
};

const InstagramPost = ({ post, onEditPost, onDeletePost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false); // 👈 toggle comments
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const lastTapRef = useRef(0);
  const menuRef = useRef(null);

  const isLiked = likes.some((id) => id.toString() === currentUserId);

  const handleLike = async () => {
    try {
      const res = await toggleLikePost(post._id);
      setLikes(res.post.likes); // update local state with fresh likes
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  // ✅ Double tap handler
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!isLiked) handleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    }
    lastTapRef.current = now;
  };

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

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmed) return;

    try {
      const res = await deleteComment(post._id, commentId);
      setComments(res.comments); // update comments after deletion
      toast.success("Comment deleted successfully!"); // show success toast
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment. Try again.");
    }
  };

  // Get current user
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

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 relative">
        {isCurrentUserPost && (
          <div className="absolute right-0" ref={menuRef}>
            <MoreHorizontal
              className="w-6 h-6 text-slate-500 cursor-pointer hover:text-slate-700"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-slate-100"
                  onClick={() => {
                    onEditPost && onEditPost(post._id);
                    setShowMenu(false);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-slate-100 text-red-500"
                  onClick={() => {
                    onDeletePost && onDeletePost(post._id);
                    setShowMenu(false);
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        )}

        {post.user.profile_picture ? (
          <img
            src={post.user.profile_picture}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-500 font-bold">
              {post.user.name?.charAt(0) || "U"}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-800">{post.user.name}</p>
          <p className="text-sm text-slate-500">@{post.user.username}</p>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-2 text-slate-800">{post.content}</p>
      )}

      {/* Swipeable Images */}
      {post.image_urls && post.image_urls.length > 0 && (
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
                className="w-full h-96 object-cover flex-shrink-0"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
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
                <Heart className="w-28 h-28 text-red drop-shadow-lg fill-red-500" />
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
      <div className="flex items-center gap-4 px-4 py-2">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-slate-600 hover:text-red-500 transition"
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
          <span>{likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-slate-600 hover:text-blue-500 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comment Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t flex flex-col max-h-80"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-slate-50 sticky top-0 z-10">
              <p className="text-sm font-semibold text-slate-700">Comments</p>
              <X
                className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700"
                onClick={() => setShowComments(false)}
              />
            </div>
            {/* Comments List */}
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
                      {c.user?.profile_picture ? (
                        <img
                          src={c.user.profile_picture}
                          alt={c.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white">
                          {c.user?.name?.charAt(0) || "U"}
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-slate-800">
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

                      {/* Delete button */}
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

      {/* Timestamp */}
      <p className="text-xs text-slate-400 px-4 pb-4">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default UserPosts;
