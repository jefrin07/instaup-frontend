import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("userData");
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        setUserData(data.user);
        setIsLoggedIn(true);
        localStorage.setItem("userData", JSON.stringify(data.user));
      } catch (err) {
        setUserData(null);
        setIsLoggedIn(false);
        localStorage.removeItem("userData");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Optional: utility to log out
  const logoutUser = async () => {
    await logout();
    setUserData(null);
    setIsLoggedIn(false);
    localStorage.removeItem("userData");
    navigate("/");
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useAppContext = () => useContext(AppContext);
