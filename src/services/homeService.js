import API from "../lib/api";

export const getFeedPosts = async (page = 1, limit = 15) => {
  const res = await API.get(`/api/post/getFeedPosts`, {
    params: { page, limit },
  });
  return res.data;
};
