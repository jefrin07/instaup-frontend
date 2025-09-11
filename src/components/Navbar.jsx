import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { isLoggedIn, userData, logoutUser } = useAppContext();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">InstaUp</Link>
      </div>

      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="hover:underline">
              {userData?.name || "Profile"}
            </Link>
            <button
              onClick={logoutUser}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
