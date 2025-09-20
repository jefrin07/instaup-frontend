import React, { useEffect, useRef, useState } from "react";
import { Heart, User, Eye } from "lucide-react";
import timeAgo from "../lib/timeago";
import {
  toggleLikeStory,
  viewStory,
  deleteStory,
} from "../services/storyService";
import { toast } from "react-toastify";

const StoryViewerModal = ({
  stories,
  startIndex,
  onClose,
  currentUserId,
  onUpdateStoryLikes,
  onDeleteStory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(32);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [showViewerList, setShowViewerList] = useState(false);
  const textRef = useRef(null);
  const intervalRef = useRef(null);

  const currentStory = stories[currentIndex];
  const isOwner = currentStory.user?._id === currentUserId;

  // Update likes, liked state, and viewers whenever the story changes
  useEffect(() => {
    if (!currentStory) return;

    setLikesCount(currentStory.likes?.length || 0);
    const alreadyLiked = currentStory.likes?.some(
      (id) => id === currentUserId || id === currentUserId?._id
    );
    setLiked(alreadyLiked);

    // Fetch viewers (excluding owner)
    viewStory(currentStory._id)
      .then((data) => {
        if (data.viewers) {
          const filtered = data.viewers.filter(
            (v) => v._id !== currentStory.user._id
          );
          setViewers(filtered);
        }
      })
      .catch(console.error);

    // Progress bar
    setProgress(0);
    clearInterval(intervalRef.current);
    let elapsed = 0;
    const duration = 4000;
    const step = 50;

    intervalRef.current = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed >= duration) {
        clearInterval(intervalRef.current);
        if (currentIndex < stories.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          onClose();
        }
      }
    }, step);

    return () => clearInterval(intervalRef.current);
  }, [currentStory]);

  // Auto-fit text for text stories
  useEffect(() => {
    if (!textRef.current) return;
    const container = textRef.current.parentElement;
    let size = 32;
    textRef.current.style.fontSize = `${size}px`;
    const maxHeight = container.clientHeight - 32;

    while (textRef.current.scrollHeight > maxHeight && size > 12) {
      size -= 1;
      textRef.current.style.fontSize = `${size}px`;
    }
    setFontSize(size);
  }, [currentIndex, stories]);

  if (!currentStory) return null;

  const handleClick = (e) => {
    const { clientX, currentTarget } = e;
    const { offsetWidth } = currentTarget;

    if (clientX < offsetWidth / 2) {
      if (currentIndex > 0) setCurrentIndex((i) => i - 1);
    } else {
      if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
      else onClose();
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentStory) return;

    const originalLiked = liked;
    const originalLikesCount = likesCount;

    const newLiked = !originalLiked;
    setLiked(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : likesCount - 1);

    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 400);

    if (onUpdateStoryLikes) {
      onUpdateStoryLikes(
        currentStory._id,
        newLiked ? likesCount + 1 : likesCount - 1,
        newLiked
      );
    }

    try {
      const data = await toggleLikeStory(currentStory._id);
      const serverLikesCount = Array.isArray(data.likes)
        ? data.likes.length
        : data.likes || 0;

      const serverLiked = Array.isArray(data.likes)
        ? data.likes.some(
            (id) => id === currentUserId || id === currentUserId?._id
          )
        : newLiked;

      setLikesCount(serverLikesCount);
      setLiked(serverLiked);

      if (onUpdateStoryLikes) {
        onUpdateStoryLikes(currentStory._id, serverLikesCount, serverLiked);
      }
    } catch (err) {
      console.error("Failed to like story", err);
      setLiked(originalLiked);
      setLikesCount(originalLikesCount);
      if (onUpdateStoryLikes) {
        onUpdateStoryLikes(currentStory._id, originalLikesCount, originalLiked);
      }
    }
  };
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!currentStory) return;
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      const data = await deleteStory(currentStory._id);
      if (data.success) {
        toast.success("Story Deleted successfully");

        onDeleteStory?.(currentStory._id);
        // Close the modal
        onClose();
      }
    } catch (err) {
      console.error("Failed to delete story", err);
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
      onClick={handleClick}
    >
      <div className="relative w-full max-w-md h-full flex flex-col justify-center ">
        <div className="absolute top-3 right-2 flex gap-2 z-20">
          {isOwner && (
            <button
              className="p-1 bg-red-600 bg-opacity-80 rounded-full text-white text-lg hover:bg-red-700 transition-colors"
              onClick={handleDelete}
            >
              🗑
            </button>
          )}

          {/* Close button */}
          <button
            className="p-1 bg-gray-800 bg-opacity-50 rounded-full text-white text-lg hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            &times;
          </button>
        </div>
        {/* Progress bar */}
        <div className="absolute top-13 left-0 right-0 flex gap-1 p-2 z-20">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 bg-gray-600 rounded overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? "100%"
                      : idx === currentIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>
        {/* Close & Delete buttons */}

        {/* Header */}
        <div className="mb-3 flex items-center gap-2 w-full px-4 z-20 relative my-20">
          {currentStory.user?.profile_picture ? (
            <img
              src={currentStory.user?.profile_picture}
              alt={currentStory.user?.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-8 h-8 rounded-full text-gray-400" />
          )}
          <span className="text-white font-medium">
            {currentStory.user?.name || "Unknown"}
          </span>
          <span className="text-gray-300 text-xs ml-auto">
            {currentStory.createdAt
              ? timeAgo(new Date(currentStory.createdAt))
              : ""}
          </span>
        </div>

        {/* Story content */}
        <div
          className="w-full flex-1 flex items-center justify-center rounded-lg px-4 relative z-10"
          style={{
            backgroundColor:
              currentStory.story_type === "text"
                ? currentStory.bg_color || "#333"
                : undefined,
          }}
        >
          {currentStory.story_type === "image" &&
          currentStory.image_urls &&
          currentStory.image_urls[0]?.url ? (
            <img
              src={currentStory.image_urls[0].url}
              alt="story"
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
          ) : (
            <p
              ref={textRef}
              className="text-white font-semibold text-center whitespace-pre-wrap break-words"
              style={{ fontSize: `${fontSize}px`, wordBreak: "break-word" }}
            >
              {currentStory.content}
            </p>
          )}
        </div>

        {/* Bottom actions */}
        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2 z-20">
          {/* Like button — only for non-owners */}
          {!isOwner && (
            <button
              className={`p-3 bg-white rounded-full shadow-lg transition-transform flex items-center justify-center ${
                animateLike ? "scale-125" : "scale-100"
              }`}
              style={{ transition: "transform 0.3s ease" }}
              onClick={handleLike}
            >
              <Heart
                size={24}
                className={liked ? "text-red-500" : "text-gray-500"}
                fill={liked ? "currentColor" : "none"}
              />
            </button>
          )}

          {/* Viewer count button — only owner */}
          {isOwner && (
            <button
              className="flex items-center gap-1 text-white text-sm bg-gray-800 bg-opacity-50 px-2 py-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowViewerList((prev) => !prev);
              }}
            >
              <Eye size={16} /> {viewers.length}
            </button>
          )}
        </div>

        {/* Viewer list dropdown — only owner */}
        {isOwner && showViewerList && (
          <div
            className="absolute bottom-20 right-6 w-48 max-h-80 overflow-y-auto bg-black bg-opacity-90 text-white rounded-lg shadow-lg p-2 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              {viewers.length === 0 && (
                <span className="text-sm text-gray-400">No views yet</span>
              )}
              {viewers.map((user) => {
                const userLiked = currentStory.likes?.some(
                  (id) => id === user._id || id === user._id?._id
                );
                return (
                  <div
                    key={user._id}
                    className="relative flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 rounded-full text-gray-400" />
                      )}
                      <span className="text-sm truncate">{user.name}</span>
                    </div>
                    {userLiked && <Heart size={16} className="text-red-500" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewerModal;
