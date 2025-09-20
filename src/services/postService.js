import API from "../lib/api";

export const addPost = async (formData) => {
  try {
    const res = await API.post("/api/post/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Add post failed:", err);
    throw err.response?.data || err;
  }
};

export const getUserPosts = async (userId, page = 1, limit = 15) => {
  const res = await API.get(
    `/api/post/user/${userId}?page=${page}&limit=${limit}`
  );
  return res.data; // returns { posts, hasMore, page, totalPages }
};

export const deletePostById = async (postId) => {
  const res = await API.delete(`/api/post/delete/${postId}`);
  return res.data;
};

export const getSinglePost = async (postId) => {
  const res = await API.get(`/api/post/get/${postId}`);
  return res.data;
};

export const deletePostImage = async (postId, public_id) => {
  const res = await API.delete(`/api/post/${postId}/image`, {
    data: { public_id: public_id },
  });
  return res.data;
};

export const updatePostContent = async (postId, content) => {
  const res = await API.put(`/api/post/update/${postId}`, { content });
  return res.data;
};

export const uploadPostImages = async (postId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const res = await API.post(`/api/post/update/image/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const toggleLikePost = async (postId) => {
  const res = await API.post("/api/post/like", { postId });
  return res.data;
};

export const addComment = async (postId, text) => {
  const res = await API.post(`/api/post/addComment`, { postId, text });
  return res.data;
};

export const deleteComment = async (postId, commentId) => {
  const res = await API.delete(`/api/post/${postId}/comments/${commentId}`);
  return res.data;
};
