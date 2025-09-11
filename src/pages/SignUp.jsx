import { Mail } from "lucide-react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { register } from "../services/authService";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAppContext();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/feed");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // reset old errors

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    setLoading(true);
    const emailToVerify = formData.email;

    try {
      const res = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      toast.success(res?.message || "Account created successfully!");
      navigate("/verify", { state: { email: emailToVerify } });
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach((e) => {
          apiErrors[e.path] = e.msg;
        });
        setErrors(apiErrors);
      } else {
        const errorMsg =
          err.response?.data?.message || "Account creation failed. Try again.";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Left Side (Branding) */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-12 lg:p-16 text-white relative">
        <img
          src={assets.bgImage}
          alt="Background"
          className="absolute inset-0 -z-10 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 -z-10"></div>

        <div>
          <img
            src={assets.logo}
            alt="logo"
            className="h-40 w-auto object-contain mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            Connect. Share. Grow. <br /> Your world, your people.
          </h1>
          <p className="mt-4 text-gray-200 text-sm md:text-base max-w-md">
            Join thousands of creators, friends, and communities already
            building connections. Stay updated, share your story, and explore
            endless opportunities.
          </p>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-3">
            <img
              src={assets.group_users}
              alt="users"
              className="h-10 w-auto md:h-12"
            />
            <div>
              <p className="text-gray-200 text-sm md:text-base font-medium">
                Trusted by 10k+ active users daily
              </p>
              <p className="text-white-400 text-xs">and growing every day 🚀</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (SignUp Form) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Create Account
          </h2>
          <p className="text-gray-500 text-center text-sm">
            Join us today! It’s quick and easy.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="text-white py-3 rounded-lg font-medium transition bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social SignUp */}
          <GoogleLoginButton />

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-pink-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
