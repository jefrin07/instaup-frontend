import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { getUserInfo, getUserPosts } from "../services/userProfile";
import {
  followUser,
  unfollowUser,
  cancelFollowRequest,
} from "../services/userService";
import UserPosts from "../components/Profile/UserPosts";
import { User } from "lucide-react";

const POSTS_PER_PAGE = 15;

const OtherUserProfile = () => {
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo(id);
        setUserInfo(info);
        setIsFollowing(info.isFollowing);
        setRequestSent(info.requestSent);
        setTotalPosts(info.totalPosts || 0);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load user info");
      }
    };
    fetchUserInfo();
  }, [id]);

  // Fetch posts
  const fetchPosts = async (pageToFetch = 1, append = false) => {
    if (!userInfo) return;
    try {
      setLoading(true);
      const res = await getUserPosts(id, pageToFetch, POSTS_PER_PAGE);

      setPosts((prev) => (append ? [...prev, ...res.posts] : res.posts));

      const totalLoaded = append
        ? posts.length + res.posts.length
        : res.posts.length;
      setHasMore(totalLoaded < res.totalPosts);
      setTotalPosts(res.totalPosts);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Initial posts load
  useEffect(() => {
    if (userInfo) {
      setPage(1);
      fetchPosts(1, false);
    }
  }, [userInfo]);

  const fetchMorePosts = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  // Follow / Unfollow / Cancel
  const handleFollow = async () => {
    try {
      await followUser(id);
      if (userInfo.isPrivate) {
        setRequestSent(true);
        toast.success("Follow request sent!");
      } else {
        setIsFollowing(true);
        setUserInfo((prev) => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1,
        }));
        toast.success("Followed successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to follow");
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(id);
      setIsFollowing(false);
      setUserInfo((prev) => ({
        ...prev,
        followersCount: Math.max((prev.followersCount || 1) - 1, 0),
      }));
      toast.success("Unfollowed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to unfollow");
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelFollowRequest(id);
      setRequestSent(false);
      toast.success("Follow request canceled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel request");
    }
  };

  // Skeleton loader for posts
  const renderPostSkeletons = () => (
    <div className="flex flex-col gap-4 my-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-slate-200 h-48 rounded-md animate-pulse" />
      ))}
    </div>
  );

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  const canViewPosts = !userInfo.isPrivate || isFollowing;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover */}
      <div className="w-full h-48 bg-slate-200 relative">
        {userInfo.cover_picture && (
          <img
            src={userInfo.cover_picture}
            alt="cover"
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute -bottom-16 left-6">
          {userInfo.profile_picture ? (
            <img
              src={userInfo.profile_picture}
              alt={userInfo.username || "profile"}
              className="w-28 h-28 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-white shadow-md bg-slate-200">
              <User className="w-14 h-14 text-slate-500" />
            </div>
          )}
        </div>
      </div>

      {/* Info & Actions */}
      <div className="max-w-3xl mx-auto mt-20 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{userInfo.name}</h2>
            <p className="text-slate-500">@{userInfo.username}</p>
            <p className="mt-2 text-slate-700">{userInfo.bio}</p>
          </div>
          <div>
            {isFollowing ? (
              <button
                onClick={handleUnfollow}
                className="px-5 py-2 rounded-full bg-slate-200 text-slate-800 font-medium hover:bg-slate-300"
              >
                Unfollow
              </button>
            ) : requestSent ? (
              <button
                onClick={handleCancelRequest}
                className="px-5 py-2 rounded-full bg-yellow-500 text-white font-medium hover:bg-yellow-600"
              >
                Cancel Request
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700"
              >
                Follow
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 font-medium text-slate-800">
          <span>{totalPosts} Posts</span>
          <span>{userInfo.followersCount || 0} Followers</span>
          <span>{userInfo.followingCount || 0} Following</span>
        </div>

        {/* Private Notice */}
        {userInfo.isPrivate && !isFollowing && (
          <div className="mt-12 text-center text-slate-500">
            <p className="text-lg">This account is private</p>
            <p className="text-sm">Follow to see their posts</p>
          </div>
        )}

        {/* Posts */}
        {canViewPosts && (
          <div
            id="scrollableDiv"
            className="mt-8 border-t pt-6 no-scrollbar"
            style={{ height: "60vh", overflowY: "auto" }}
          >
            {posts.length === 0 && !loading ? (
              <p className="text-center text-slate-500 mt-4">No posts yet</p>
            ) : (
              <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                hasMore={hasMore}
                loader={renderPostSkeletons()}
                scrollableTarget="scrollableDiv"
                endMessage={
                  posts.length > 0 && (
                    <p className="text-center text-slate-500 mt-4">No more posts</p>
                  )
                }
              >
                <UserPosts posts={posts} loading={loading} />
              </InfiniteScroll>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherUserProfile;
