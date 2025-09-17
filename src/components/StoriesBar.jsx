import React, { useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import AddStoryModal from "./AddStoryModal";
import StoryViewerModal from "./StoryViewerModal";
import StoryItem from "./StoryItem";
import { dummyStoriesData } from "../assets/assets";

const StoriesBar = () => {
  const scrollRef = useRef(null);
  const { userData } = useAppContext();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // --- Drag Scroll ---
  const startDrag = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
    document.body.style.userSelect = "none";
  };

  const stopDrag = () => {
    setIsDragging(false);
    document.body.style.userSelect = "auto";
  };

  const handleDrag = (clientX) => {
    if (!isDragging) return;
    const walk = clientX - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const openStory = (index) => {
    setCurrentStoryIndex(index);
    setIsStoryOpen(true);
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar p-3 bg-white rounded-2xl border border-gray-200 mb-6 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => handleDrag(e.clientX)}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => {
          e.preventDefault(); // prevent page scroll
          handleDrag(e.touches[0].clientX);
        }}
        onTouchEnd={stopDrag}
      >
        {/* User Story */}
        <StoryItem
          story={{ avatar: userData.profile_picture, user: { name: "You" } }}
          isOwnStory
          onClick={() => setIsAddStoryOpen(true)}
        />

        {/* Other Stories */}
        {dummyStoriesData.map((story, index) => (
          <StoryItem
            key={story._id}
            story={story}
            onClick={() => openStory(index)}
          />
        ))}
      </div>

      <AddStoryModal
        isOpen={isAddStoryOpen}
        onClose={() => setIsAddStoryOpen(false)}
      />
      {isStoryOpen && (
        <StoryViewerModal
          stories={dummyStoriesData}
          startIndex={currentStoryIndex}
          onClose={() => setIsStoryOpen(false)}
        />
      )}
    </>
  );
};

export default StoriesBar;
