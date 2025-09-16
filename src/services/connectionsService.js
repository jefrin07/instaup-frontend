import API from "../lib/api";

export const getConnections = async () => {
  const res = await API.get("/api/connections");
  return res.data;
};

export const acceptFollowRequest = async (requesterId) => {
  const { data } = await API.post("/api/connections/accept-request", {
    requesterId,
  });
  return data;
};

export const rejectFollowRequest = async (requesterId) => {
  const { data } = await API.post("/api/connections/reject-request", {
    requesterId,
  });
  return data;
};
