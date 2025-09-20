import API from "../lib/api";

export const addstory = async (formData) => {
  const res = await API.post("/api/story/addstory", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, // if your backend uses cookies/auth
  });

  return res.data;
};
export const getStories = async () => {
  const res = await API.get("/api/story/getStories");
  return res.data;
};

export const toggleLikeStory = async (storyId) => {
  const res = await API.put(`/api/story/toggleLikeStory/${storyId}`);
  return res.data; // { success, message, likes }
};

export const viewStory = async (storyId) => {
  const res = await API.put(`/api/story/viewStory/${storyId}`);
  return res.data; // { success, message, views }
};

export const deleteStory = async (storyId) => {
  const res = await API.delete(`/api/story/deleteStory/${storyId}`);
  return res.data; // { success, message, views }
};
