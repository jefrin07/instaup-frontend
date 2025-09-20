import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import StoriesBar from "../components/StoriesBar";
import RightSidebar from "../components/RightSidebar";
import { getFeedPosts } from "../services/homeService";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  // 🔹 Initial fetch
  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  // 🔹 Fetch posts (append or reset)
  const fetchPosts = async (pageNumber = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setFetchingMore(true);
      }

      const startTime = Date.now();
      const res = await getFeedPosts(pageNumber, 15);

      const elapsed = Date.now() - startTime;
      const minDelay = 800;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, minDelay - elapsed))
      );

      if (reset) {
        setFeeds(res.posts || []);
      } else {
        setFeeds((prev) => [...prev, ...(res.posts || [])]);
      }
      setHasMore(res.hasMore);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  return (
    <div className="flex h-screen w-full gap-4 px-4 overflow-hidden">
      {/* Center feed */}
      <div className="flex-1 flex flex-col overflow-hidden h-full mx-auto">
        <div
          className="flex-1 overflow-y-auto no-scrollbar
           py-4 select-none"
          id="scrollableFeed"
        >
          <StoriesBar />

          {loading && feeds.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))
          ) : feeds.length > 0 ? (
            <InfiniteScroll
              dataLength={feeds.length}
              next={() => fetchPosts(page + 1)}
              hasMore={hasMore}
              loader={
                fetchingMore && (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )
              }
              endMessage={
                <p className="text-slate-500 text-center mt-6">
                  🎉 You’ve seen all posts!
                </p>
              }
              scrollableTarget="scrollableFeed"
            >
              {feeds.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </InfiniteScroll>
          ) : (
            <p className="text-slate-500 text-center mt-6">
              No posts from people you follow yet.
            </p>
          )}
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
