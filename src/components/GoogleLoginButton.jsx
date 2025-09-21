import { GoogleLogin } from "@react-oauth/google";
import { useAppContext } from "../context/AppContext";
import { googleLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleLoginButton = () => {
  const { setIsLoggedIn, setUserData, isLoggedIn, connectSocket } =
    useAppContext();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("No credential returned from Google. Please try again.");
      return;
    }

    try {
      const res = await googleLogin(credentialResponse.credential);
      if (!res?.user) {
        toast.error("Login failed: No user data returned.");
        return;
      }

      setUserData(res.user);
      localStorage.setItem("userData", JSON.stringify(res.user));
      setIsLoggedIn(true);
      if (res?.user) {
        connectSocket(res.user);
      }

      toast.success(res.message || "Google login successful!");
      navigate("/feed");
    } catch (err) {
      console.error("Google login error:", err.response || err.message || err);
      toast.error(
        err.response?.data?.message || "Google login failed. Please try again."
      );
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
        disabled={isLoggedIn} // prevents multiple logins
      />
    </div>
  );
};

export default GoogleLoginButton;
