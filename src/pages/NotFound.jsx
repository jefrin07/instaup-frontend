import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {/* Big 404 */}
      <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
        404
      </h1>

      {/* Message */}
      <p className="text-lg text-gray-700 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Button */}
      <Link
        to="/feed"
        className="inline-block px-6 py-3 text-white font-medium rounded-lg shadow-lg transition bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90"
      >
        Go to Feed
      </Link>
    </div>
  );
};

export default NotFound;
