import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

const STORY_DURATION = 5000;

const StoryViewerModal = ({ stories, startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentStory = stories[currentIndex];

  // Disable text selection globally in modal
  useEffect(() => {
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.userSelect = "auto";
    };
  }, []);

  // Auto-advance for image/text
  useEffect(() => {
    if (!currentStory) return;
    if (currentStory.media_type === "image" || currentStory.media_type === "text") {
      timerRef.current = setTimeout(nextStory, STORY_DURATION);
    }
    return () => clearTimeout(timerRef.current);
  }, [currentIndex, currentStory]);

  const nextStory = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
    else onClose();
  };

  const prevStory = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) deltaX > 0 ? nextStory() : prevStory();
  };

  if (!currentStory) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => e.preventDefault()} // prevent accidental selection
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-white z-50"
        onClick={onClose}
      >
        <X size={28} />
      </button>

      {/* Header: User avatar & name */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-50">
        <img
          src={currentStory.user?.avatar}
          alt={currentStory.user?.name}
          className="w-8 h-8 rounded-full object-cover border-2 border-white"
        />
        <span className="text-white font-semibold text-sm">
          {currentStory.user?.name || "User"}
        </span>
      </div>

      {/* Progress bars */}
      <div className="absolute top-14 left-4 right-4 flex gap-1 z-50">
        {stories.map((_, idx) => (
          <div key={idx} className="h-1 bg-white bg-opacity-50 flex-1 rounded">
            <div
              className={`h-1 bg-white rounded ${idx < currentIndex ? "w-full" : "w-0"}`}
              style={{
                transition:
                  idx === currentIndex ? `width ${STORY_DURATION}ms linear` : "",
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
            className="object-contain w-full h-full"
            draggable={false} // prevent drag on image
          />
        )}
        {currentStory.media_type === "video" && (
          <video
            src={currentStory.media_url}
            className="object-contain w-full h-full"
            autoPlay
            controls
            onEnded={nextStory}
            draggable={false}
          />
        )}
        {currentStory.media_type === "text" && (
          <div
            className="flex items-center justify-center text-white text-3xl font-semibold text-center p-6 w-full h-full"
            style={{ backgroundColor: currentStory.background_color }}
          >
            {currentStory.content}
          </div>
        )}
      </div>

      {/* Click areas */}
      <div
        className="absolute inset-0 flex justify-between items-center px-4 cursor-pointer"
        onClick={(e) =>
          e.clientX < window.innerWidth / 2 ? prevStory() : nextStory()
        }
      />
    </div>
  );
};

export default StoryViewerModal;
