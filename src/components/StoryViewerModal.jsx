import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

const STORY_DEFAULT_DURATION = 5000; // 5s for image/text

const StoryViewerModal = ({ stories, startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentStory = stories[currentIndex];

  // Disable text selection
  useEffect(() => {
    document.body.style.userSelect = "none";
    return () => (document.body.style.userSelect = "auto");
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevStory();
      if (e.key === "ArrowRight") nextStory();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  // Auto-advance for image/text, or video duration
  useEffect(() => {
    if (!currentStory || isPaused) return;

    let duration = STORY_DEFAULT_DURATION;
    if (currentStory.media_type === "video") {
      const video = document.getElementById("story-video");
      if (video) {
        duration = video.duration * 1000;
        video.play();
      }
    }

    if (currentStory.media_type !== "video") {
      timerRef.current = setTimeout(nextStory, duration);
    }

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, currentStory, isPaused]);

  const nextStory = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
    else onClose();
  };

  const prevStory = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Touch navigation
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) deltaX > 0 ? nextStory() : prevStory();
  };

  if (!currentStory) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
    >
      {/* Close Button */}
      <button
        className="absolute top-5 right-5 text-white z-50 hover:text-gray-300 transition"
        onClick={onClose}
      >
        <X size={28} />
      </button>

      {/* Header: User Avatar & Name */}
      <div className="absolute top-5 left-5 flex items-center gap-3 z-50">
        {currentStory.user?.avatar && (
          <img
            src={currentStory.user.avatar}
            alt={currentStory.user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        )}
        <span className="text-white font-semibold text-lg">
          {currentStory.user?.name || "User"}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="absolute top-16 left-4 right-4 flex gap-1 z-50">
        {stories.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white bg-opacity-30 rounded overflow-hidden">
            <div
              className={`h-1 bg-white rounded`}
              style={{
                width:
                  idx < currentIndex
                    ? "100%"
                    : idx === currentIndex
                    ? isPaused
                      ? "paused"
                      : "100%"
                    : "0%",
                transition:
                  idx === currentIndex
                    ? `width ${STORY_DEFAULT_DURATION}ms linear`
                    : "width 0.3s linear",
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div className="w-full max-w-md h-full flex items-center justify-center relative">
        {currentStory.media_type === "image" && (
          <img
            src={currentStory.media_url}
            alt="story"
            className="object-contain w-full h-full rounded-lg shadow-lg"
            draggable={false}
          />
        )}
        {currentStory.media_type === "video" && (
          <video
            id="story-video"
            src={currentStory.media_url}
            className="object-contain w-full h-full rounded-lg shadow-lg"
            autoPlay
            controls
            onEnded={nextStory}
            draggable={false}
          />
        )}
        {currentStory.media_type === "text" && (
          <div
            className="flex items-center justify-center text-white text-3xl font-bold text-center p-6 w-full h-full rounded-lg shadow-inner"
            style={{ backgroundColor: currentStory.background_color || "#111" }}
          >
            {currentStory.content}
          </div>
        )}
      </div>

      {/* Click Areas */}
      <div
        className="absolute inset-0 flex justify-between items-center px-4 cursor-pointer z-40"
        onClick={(e) =>
          e.clientX < window.innerWidth / 2 ? prevStory() : nextStory()
        }
      />
    </div>
  );
};

export default StoryViewerModal;
