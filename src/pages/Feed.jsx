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
    const fetchPosts = async () => {
      setLoading(true);
      setTimeout(() => {
        setFeeds(dummyPostsData);
        setLoading(false);
      }, 1500); // Replace with real API call
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex h-screen w-full gap-4 px-4 overflow-hidden">
      {/* Center feed */}
      <div className="flex-1 flex flex-col overflow-hidden h-full  mx-auto">
        {/* Posts scrollable */}
        <div className="flex-1 overflow-y-auto no-scrollbar  py-4">
          <StoriesBar />

          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : feeds.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:flex w-80 flex-shrink-0 sticky top-0 h-screen">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Feed;
