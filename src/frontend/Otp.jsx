import axios from "axios";
import { useState } from "react";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleOnChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    if (otp.trim().length < 4) {
      setMessage("OTP must be at least 4 digits.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        `http://localhost:8080/register/verify-email/${otp}`
      );

      console.log(response.data);
      setMessage("OTP Verified Successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Invalid or expired OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-white flex justify-center items-center">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-96 flex flex-col gap-6">

        <h1 className="text-2xl font-semibold text-center mb-2">
          Verify Your Email
        </h1>

        {/* OTP Input */}
        <input
          type="text"
          onChange={handleOnChange}
          value={otp}
          name="otp"
          maxLength="6"
          placeholder="Enter OTP"
          className="w-full px-4 py-3 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg tracking-widest text-center"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-md text-lg font-medium transition-all 
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
          `}
        >
          {loading ? "Verifying..." : "Submit"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("Successfully")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Otp;
