import API from "../lib/api";

export const updateProfile = async (userData) => {
  const res = await API.post("/api/profile/update", userData);
  return res.data;
};
export const deleteAvatar = async () => {
  try {
    const res = await API.delete("/api/profile/avatar/delete");
    return res.data;
  } catch (error) {
    console.error("Delete avatar failed:", error);
    throw error;
  }
};
export const deleteCoverPic = async () => {
  try {
    const res = await API.delete("/api/profile/coverpic/delete");
    return res.data;
  } catch (error) {
    console.error("Delete coverpic failed:", error);
    throw error;
  }
};
export const uploadAvatar = async (file) => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("avatar", file); // MUST match backend multer field

  const res = await API.put("/api/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, // if your backend uses cookies/auth
  });

  return res.data;
};

export const uploadCoverPic = async (file) => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("coverpic", file); // MUST match backend multer field

  const res = await API.put("/api/profile/coverpic", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, // if your backend uses cookies/auth
  });

  return res.data;
};

export const toggleAccountType = async () => {
  const { data } = await API.put("/api/profile/setAccountType"); // endpoint you made in backend
  return data;
};

export const getUserInfo = async (id) => {
  const res = await API.get(`/api/profile/getUserInfo/${id}`);
  return res.data.user;
};

export const getUserPosts = async (id, page = 1, limit = 15) => {
  const res = await API.get(`/api/profile/getUserPosts/${id}`, {
    params: { page, limit },
  });
  return res.data; // { posts: [...], totalPosts: number }
};
