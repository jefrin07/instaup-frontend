import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { checkVerification, login, googleLogin } from "../services/authService";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, setUserData, isLoggedIn } = useAppContext();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/feed");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const check = await checkVerification({ email: formData.email });

      if (!check.isAccountVerified) {
        toast.info("Please verify your email before logging in.");
        navigate("/verify", { state: { email: formData.email } });
        return;
      }

      const res = await login(formData);
      setUserData(res?.user || null);
      localStorage.setItem("userData", JSON.stringify(res?.user));
      setIsLoggedIn(true);

      setFormData({ email: "", password: "" });
      toast.success(res?.message || "Logged in successfully!");
      navigate("/feed");
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.message || "Login failed. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <img
        src={assets.bgImage}
        alt="Background"
        className="absolute inset-0 -z-10 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 -z-10"></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src={assets.logo}
            alt="logo"
            className="h-40 w-auto object-contain"
          />
        </div>

        {/* Form */}
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            disabled={loading}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            disabled={loading}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-pink-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Instagram Gradient Button */}
          <button
            type="submit"
            disabled={loading}
            className="text-white py-3 rounded-xl font-medium transition bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* ✅ Google Login */}
        <GoogleLoginButton />
        {/* Sign up link */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-pink-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
