import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiLock } from "react-icons/fi";
import loginBg from "../assets/login-bg.png";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = formData;
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Invalid username or password.");
        } else {
          alert("Server error. Try again later.");
        }
        return;
      }

      const data = await response.json();
      console.log("Login token:", data);

      if (data) {
        // Store token and refresh token
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userid", data.user_id);

        // ⭐ Store username in localStorage
        // ⭐ Store username in localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("Role", data.role)
        if (data.role === "ADMIN") {
          navigate("/admin");
        } else {

          navigate("/homepage");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login clicked");
  };

  const isFormValid = formData.username && formData.password;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative bg-white/85 backdrop-blur-md p-10 rounded-2xl w-[380px] shadow-2xl z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900">Welcome Back</h1>
          <p className="text-gray-600 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block mb-1 text-gray-800 text-sm">Username</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-1 text-gray-800 text-sm">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition 
              ${isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-green-700"}
              ${!isFormValid ? "bg-gray-300 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center my-5 text-gray-600 text-sm">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="px-3">Or continue with</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg font-medium hover:shadow-lg transition"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        <div className="text-center mt-6 text-sm">
          <NavLink
            to="/forgot-password"
            className="text-green-600 hover:text-green-800"
          >
            Forgot your password?
          </NavLink>
          <div className="mt-2">
            Don’t have an account?{" "}
            <NavLink
              to="/signup"
              className="text-green-600 font-semibold hover:text-green-800"
            >
              Sign up
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


