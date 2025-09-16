import API from "../lib/api";

export const discoverUsers = async (userData) => {
  const res = await API.post("/api/user/discover", userData);
  return res.data;
};

export const followUser = async (followid) => {
  const res = await API.post("/api/user/followUser", { followid });
  return res.data;
};
export const unfollowUser = async (followid) => {
  const res = await API.post("/api/user/unfollowUser", { followid });
  return res.data;
};

export const cancelFollowRequest = async (followid) => {
  const res = await API.post("/api/user/cancelFollowRequest", { followid });
  return res.data;
};

