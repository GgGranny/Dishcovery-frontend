import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Otp = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change for OTP digits
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Submit OTP to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setMessage("⚠️ Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // ✅ Send OTP in request body + headers
      const response = await axios.get(
        `http://localhost:8080/register/verify-email/${token}`,
        { otp: otpValue },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(`✅ ${response.data.message || "Email verified successfully!"}`);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.response) {
        setMessage(
          `❌ Verification failed: ${
            error.response.data.message || "Invalid OTP."
          }`
        );
      } else {
        setMessage("⚠️ Server error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Verify Your Email
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Token: <span className="font-mono">{token}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-white ${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 transition"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Otp;
