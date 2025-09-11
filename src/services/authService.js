import API from "../lib/api";

export const register = async (userData) => {
  const res = await API.post("/api/auth/register", userData);
  return res.data;
};

export const verifyEmail = async (data) => {
  const res = await API.post("/api/auth/verify-email", data);
  return res.data;
};
export const resendOtp = async (data) => {
  const res = await API.post("/api/auth/resend-Otp", data);
  return res.data;
};

export const login = async (credentials) => {
  const res = await API.post("/api/auth/login", credentials);
  return res.data;
};

export const checkVerification = async (data) => {
  const res = await API.post("/api/auth/check-verification", data);
  return res.data;
};

export const logout = async () => {
  const res = await API.post("/api/auth/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/api/auth/me");
  return res.data;
};

export const sendResetOtp = async (email) => {
  const res = await API.post("/api/auth/send-reset-otp", { email });
  return res.data;
};

export const verifyResetOtp = async (data) => {
  const res = await API.post("/api/auth/verify-reset-otp", data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await API.post("/api/auth/reset-password", data);
  return res.data;
};

export const googleLogin = async (token) => {
  const res = await API.post("/api/auth/google/callback", { token });
  return res.data;
};
