import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const PrivateRoute = () => {
  const { isLoggedIn, loading } = useAppContext();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />; // login page
  }

  // Render nested routes
  return <Outlet />;
};

export default PrivateRoute;
