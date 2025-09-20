import React, { useRef, useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import AddStoryModal from "./AddStoryModal";
import StoryViewerModal from "./StoryViewerModal";
import StoryItem from "./StoryItem";
import { addstory, getStories } from "../services/storyService";
import { toast } from "react-toastify";

const StoriesBar = () => {
  const scrollRef = useRef(null);
  const { userData } = useAppContext();
  const [stories, setStories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);

  // Fetch stories on mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await getStories();
        setStories(res.stories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStories();
  }, []);

  // Group stories by user
  const grouped = {};
  stories.forEach((story) => {
    const uid = story.user?._id;
    if (!uid) return;
    if (!grouped[uid]) grouped[uid] = { user: story.user, stories: [] };
    grouped[uid].stories.push(story);
  });
  const groupedUsers = Object.values(grouped);

  // Drag scroll handlers
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

  // Add new story
  const handleAddStory = async (newStory) => {
    try {
      const formData = new FormData();
      formData.append("story_type", newStory.story_type);
      formData.append("content", newStory.content || "");
      formData.append("bg_color", newStory.bg_color || "");
      if (newStory.media_file) formData.append("image", newStory.media_file);

      const data = await addstory(formData);
      setStories((prev) => [data.story, ...prev]);
      toast.success("Story added successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add story ❌");
    }
  };

  // Update likes in main stories array
  const handleUpdateStoryLikes = (storyId, likesCount, liked) => {
    setStories((prev) =>
      prev.map((story) => {
        if (story._id !== storyId) return story;

        let updatedLikes;
        if (liked) {
          // Add current user if not already present
          const hasUser = story.likes?.some(
            (id) => id === userData._id || id === userData._id?._id
          );
          updatedLikes = hasUser
            ? story.likes
            : [...(story.likes || []), userData._id];
        } else {
          // Remove current user
          updatedLikes = (story.likes || []).filter(
            (id) => id !== userData._id && id !== userData._id?._id
          );
        }

        return {
          ...story,
          likes: updatedLikes,
        };
      })
    );
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide p-3 no-scrollbar bg-white rounded-2xl border border-gray-200 mb-6 cursor-grab active:cursor-grabbing select-none snap-x snap-mandatory"
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => handleDrag(e.clientX)}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => {
          e.preventDefault();
          handleDrag(e.touches[0].clientX);
        }}
        onTouchEnd={stopDrag}
      >
        {/* Add Story always first */}
        <StoryItem
          story={{ avatar: userData?.profile_picture, user: { name: "You" } }}
          onClick={() => setIsAddStoryOpen(true)}
        />
        {/* Render grouped stories */}
        {groupedUsers.map((group, idx) => (
          <StoryItem
            key={group.user._id}
            story={{
              avatar: group.user.profile_picture,
              user: group.user,
              likesCount: group.stories.reduce(
                (acc, s) => acc + (s.likes?.length || 0),
                0
              ),
            }}
            onClick={() => setSelectedStoryIndex(idx)}
          />
        ))}
      </div>

      {/* Add Story Modal */}
      <AddStoryModal
        isOpen={isAddStoryOpen}
        onClose={() => setIsAddStoryOpen(false)}
        onAddStory={handleAddStory}
      />

      {/* Story Viewer */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={groupedUsers[selectedStoryIndex].stories}
          startIndex={0}
          onClose={() => setSelectedStoryIndex(null)}
          currentUserId={userData?._id}
          onUpdateStoryLikes={handleUpdateStoryLikes}
          onDeleteStory={(deletedStoryId) => {
            // Remove deleted story from parent state
            setStories((prev) => prev.filter((s) => s._id !== deletedStoryId));
            setSelectedStoryIndex(null);
          }}
        />
      )}
    </>
  );
};

export default StoriesBar;
