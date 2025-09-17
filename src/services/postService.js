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

export const getUserPosts = async (userId) => {
  const res = await API.get(`/api/post/user/${userId}`);
  return res.data;
};
