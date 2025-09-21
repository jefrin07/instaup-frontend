import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import { io } from "socket.io-client";
import BASE_URL from "../lib/config";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState({});
  const [socket, setSocket] = useState(null);

  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("userData");
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch user
  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser();
      setUserData(data.user);
      setIsLoggedIn(true);
      localStorage.setItem("userData", JSON.stringify(data.user));
      connectSocket(data.user); // ✅ connect once user is known
    } catch (err) {
      setUserData(null);
      setIsLoggedIn(false);
      localStorage.removeItem("userData");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Socket connection
  const connectSocket = (user) => {
    if (!user || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: { userId: user._id },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      // convert array → map
      const onlineMap = {};
      userIds.forEach((id) => {
        onlineMap[id] = true;
      });
      setOnlineUsers(onlineMap);
    });

    // ✅ cleanup
    newSocket.on("disconnect", () => {
      setOnlineUsers({});
    });
  };

  // ✅ Logout
  const logoutUser = async () => {
    try {
      await logout();
    } finally {
      localStorage.removeItem("userData");
      setUserData(null);
      setIsLoggedIn(false);
      setOnlineUsers({});
      if (socket) socket.disconnect();
      navigate("/");
    }
  };

  const value = {
    navigate,
    userData,
    setUserData,
    isLoggedIn,
    setIsLoggedIn,
    loading,
    setLoading,
    logoutUser,
    onlineUsers,
    socket,
    connectSocket
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
