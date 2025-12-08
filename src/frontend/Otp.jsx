import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setOtp(e.target.value);
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = async () => {
    if (!otp) {
      setMessage({ text: "⚠️ Please enter the OTP first.", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/register/verify-email/${otp}`
      );

      if (response.status === 200) {
        setMessage({
          text: "✅ Email verified successfully! Redirecting to login...",
          type: "success",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage({
          text: "❌ Verification failed. Please check your OTP and try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.response?.status === 400) {
        setMessage({ text: "❌ Invalid OTP. Please try again.", type: "error" });
      } else if (error.response?.status === 401) {
        setMessage({
          text: "⚠️ Unauthorized. OTP may be expired.",
          type: "error",
        });
      } else {
        setMessage({
          text: "⚠️ Server error. Please try again later.",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md flex flex-col items-center gap-6 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-semibold text-green-600">
          Email Verification
        </h1>

        <p className="text-gray-600 text-center text-sm">
          Enter the 6-digit OTP sent to your registered email address.
        </p>

        <input
          type="text"
          value={otp}
          onChange={handleOnChange}
          name="otp"
          placeholder="Enter OTP"
          maxLength={6}
          className="w-3/4 text-center tracking-widest text-lg p-3 border-2 border-gray-300 rounded-lg outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-300"
        />

        {message.text && (
          <p
            className={`text-sm font-medium text-center ${
              message.type === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-3/4 py-3 rounded-lg text-white font-semibold text-lg shadow-md transition transform ${
            isLoading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Didn’t receive OTP?{" "}
          <span className="text-green-600 font-medium cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default Otp;
