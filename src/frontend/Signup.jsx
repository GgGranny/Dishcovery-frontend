import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import signupBg from "../assets/login-bg.png";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/otp");
      } else {
        alert(data.message || "Signup failed.");
      }
    } 
    finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${signupBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Signup Box */}
      <div className="relative bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl w-[400px] p-10 z-10">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900">Create Account</h1>
          <p className="text-gray-600 text-sm mt-1">Sign up to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup}>
          {/* Username */}
          <div className="mb-5">
            <label className="block mb-1 text-sm text-gray-800">Username</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block mb-1 text-sm text-gray-800">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block mb-1 text-sm text-gray-800">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block mb-1 text-sm text-gray-800">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Signup button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`
              w-full py-3 rounded-lg font-semibold text-white transition 
              ${!isFormValid ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing up...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-5 text-gray-600 text-sm">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="px-3">Or continue with</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        {/* Google signup */}
        <button
          onClick={() => console.log("Google signup clicked")}
          className="w-full bg-white border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 font-medium hover:shadow-lg transition"
        >
          <FcGoogle className="text-xl" />
          Sign up with Google
        </button>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-800">
          Already have an account?{" "}
          <NavLink to="/login" className="text-green-600 hover:text-green-800">
            Sign in
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Signup;
