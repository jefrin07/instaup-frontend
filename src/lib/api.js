import axios from "axios";
import BASE_URL from "./config";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send/receive cookies (token is stored in cookie)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let onUnauthorizedFn = null;

/**
 * Set a callback for handling unauthorized responses (401)
 */
export const setOnUnauthorized = (fn) => {
  onUnauthorizedFn = fn;
};

// 🚦 Response interceptor (handle global errors)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorizedFn) {
      onUnauthorizedFn(); // e.g. force logout or redirect
    }
    return Promise.reject(error);
  }
);

export default API;
