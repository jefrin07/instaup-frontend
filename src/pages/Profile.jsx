import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

import CoverImage from "../components/Profile/CoverImage";
import AvatarImage from "../components/Profile/AvatarImage";
import ProfileInfo from "../components/Profile/ProfileInfo";
import EditProfileModal from "../components/Profile/EditProfileModal";
import UserPosts from "../components/Profile/UserPosts";

import { updateProfile } from "../services/userProfile";
import { getCurrentUser } from "../services/authService";
import { getUserPosts, deletePostById } from "../services/postService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [previewProfile, setPreviewProfile] = useState("");
  const [previewCover, setPreviewCover] = useState("");

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  // 🔹 Helper to ensure minimum spinner time
  const withMinDelay = async (promise, delay = 500) => {
    const start = Date.now();
    const result = await promise;
    const elapsed = Date.now() - start;
    if (elapsed < delay) {
      await new Promise((res) => setTimeout(res, delay - elapsed));
    }
    return result;
  };

  // 🔹 Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await withMinDelay(getCurrentUser(), 1000);
        setUserData(res.user);
        setFormData(res.user);
        setPreviewProfile(res.user?.profile_picture || "");
        setPreviewCover(res.user?.cover_picture || "");
        localStorage.setItem("userData", JSON.stringify(res.user));
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Fetch posts when userData changes
  useEffect(() => {
    if (userData) {
      fetchPosts(1, true);
    }
  }, [userData]);

  const fetchPosts = async (pageNumber = 1, reset = false) => {
    try {
      if (reset) setPostsLoading(true);
      const res = await getUserPosts(userData._id, pageNumber, 15);
      if (reset) {
        setPosts(res.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(res.posts || [])]);
      }
      setHasMore(res.hasMore);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to load posts:", err);
      toast.error("Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };

  const refreshPosts = async () => {
    setPage(1);
    await fetchPosts(1, true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrors({});
      const updated = await updateProfile(formData);
      setUserData(updated.user);
      setFormData(updated.user);
      setPreviewProfile(updated.user?.profile_picture || "");
      setPreviewCover(updated.user?.cover_picture || "");
      localStorage.setItem("userData", JSON.stringify(updated.user));
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Profile update failed:", err);
      if (Array.isArray(err.response?.data?.errors)) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.path] = e.msg;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(err.response?.data?.message || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePostById(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/post/${postId}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">No profile data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CoverImage
        previewCover={previewCover}
        setPreviewCover={setPreviewCover}
      />

      <div className="max-w-3xl mx-auto -mt-16 p-6">
        <div className="bg-white rounded-2xl shadow p-6 relative">
          <AvatarImage
            previewProfile={previewProfile}
            setPreviewProfile={setPreviewProfile}
          />
          <ProfileInfo
            userData={userData}
            posts={posts.length}
            onEdit={() => {
              setFormData(userData);
              setErrors({});
              setIsEditing(true);
            }}
          />
        </div>

        <div className="mt-6 relative">
          <div
            className="grid grid-cols-1 gap-4 no-scrollbar"
            style={{ height: "60vh", overflowY: "auto" }}
            id="scrollableUserPosts"
          >
            {postsLoading && posts.length === 0 ? (
              <div className="flex justify-center items-center py-10 col-span-1">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
              <p className="text-slate-500 text-center col-span-3">
                No posts yet
              </p>
            ) : (
              <InfiniteScroll
                dataLength={posts.length}
                next={() => fetchPosts(page + 1)}
                hasMore={hasMore}
                scrollableTarget="scrollableUserPosts"
                pullDownToRefresh
                pullDownToRefreshThreshold={80}
                refreshFunction={refreshPosts}
                pullDownToRefreshContent={
                  <p className="text-center text-slate-500 py-2">
                    ↓ Pull to refresh
                  </p>
                }
                releaseToRefreshContent={
                  <p className="text-center text-slate-500 py-2">
                    ↑ Release to refresh
                  </p>
                }
              >
                {posts.map((post) => (
                  <UserPosts
                    key={post._id}
                    posts={[post]}
                    onDeletePost={handleDeletePost}
                    onEditPost={handleEditPost}
                  />
                ))}
              </InfiniteScroll>
            )}

            {postsLoading && posts.length > 0 && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
};

export default Profile;
