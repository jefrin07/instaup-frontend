import React, { useEffect, useState } from "react";
import { dummyPostsData } from "../assets/assets";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import StoriesBar from "../components/StoriesBar";
import RightSidebar from "../components/RightSidebar";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFeeds(dummyPostsData);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="flex h-screen w-full gap-4 px-4">
      {/* Center feed */}
      <div className="flex-1 max-w-xl mx-auto overflow-y-auto h-full no-scrollbar py-10">
        <StoriesBar />
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
          : feeds.map((post) => <PostCard key={post._id} post={post} />)}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:flex w-80 flex-shrink-0">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Feed;
