import API from "../lib/api";

export const getFollowingUsers = async () => {
  const res = await API.get("/api/chat/getFollowingUsers");
  return res.data;
};
export const getChat = async (userId) => {
  const res = await API.get(`/api/chat/getChat/${userId}`);
  return res.data;
};
export const markMsg = async (userId) => {
  const res = await API.put(`/api/chat/mark/${msgId}`);
  return res.data;
};
export const sendMsg = async (userId, formData) => {
  const res = await API.post(`/api/chat/sendMsg/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
