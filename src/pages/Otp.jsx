import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { resendOtp, verifyEmail } from "../services/authService";

const Otp = () => {
  const OTP_LENGTH = 6;
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(null); // initially no timer
  const [status, setStatus] = useState(null);
  const inputRefs = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate("/sign-up");
  }, [email, navigate]);

  // Countdown effect
  useEffect(() => {
    if (resendTimer !== null && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    if (/^\d+$/.test(value)) {
      const lastChar = value.slice(-1);
      const newOtp = [...otp];
      newOtp[index] = lastChar;
      setOtp(newOtp);

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (/^\d+$/.test(paste)) {
      const newOtp = paste
        .split("")
        .concat(Array(OTP_LENGTH - paste.length).fill(""));
      setOtp(newOtp);
      inputRefs.current[Math.min(paste.length, OTP_LENGTH) - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < OTP_LENGTH) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await verifyEmail({ email, otp: enteredOtp });
      setStatus("success");
      toast.success(res.message || "OTP Verified Successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setStatus("error");
      toast.error(err.response?.data?.message || "Invalid OTP. Try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit once all digits are filled
  useEffect(() => {
    if (otp.join("").length === OTP_LENGTH) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleResend = async () => {
    if (!resendTimer || resendTimer === 0) {
      try {
        await resendOtp({ email });
        toast.success("OTP resent successfully!");
        setOtp(Array(OTP_LENGTH).fill(""));
        setResendTimer(30); // start timer only after resend
        setStatus(null);
        inputRefs.current[0]?.focus();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to resend OTP.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-14 h-14 text-pink-600 dark:text-pink-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
            Verify Your Account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-1">
            Enter the {OTP_LENGTH}-digit code sent to{" "}
            <span className="font-medium">{email}</span>.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={loading}
                className={`w-12 h-12 text-center text-white text-lg border rounded-lg focus:outline-none transition font-semibold
                  ${
                    status === "error"
                      ? "border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-pink-500"
                  } 
                  ${
                    status === "success"
                      ? "bg-green-100 border-green-400 dark:bg-green-900"
                      : ""
                  }
                  ${
                    loading
                      ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                      : ""
                  }`}
                aria-label={`Digit ${index + 1}`}
                autoComplete="one-time-code"
                as={motion.input}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.join("").length < OTP_LENGTH || loading}
            className="w-full flex justify-center items-center text-white py-3 rounded-lg font-medium transition bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            {loading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Status Feedback */}
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium"
            >
              <CheckCircle2 className="h-5 w-5" /> OTP Verified Successfully!
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-medium"
            >
              <XCircle className="h-5 w-5" /> Invalid OTP. Try again.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resend */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Didn’t get the code?{" "}
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-pink-600 dark:text-pink-400 hover:underline font-medium disabled:opacity-50"
          >
            {resendTimer !== null && resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : "Resend"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Otp;
