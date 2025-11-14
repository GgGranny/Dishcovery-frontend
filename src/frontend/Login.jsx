import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiLock } from "react-icons/fi";
import axios from "axios";
import "../css/Login.css";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Use POST request for login
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });

      if (response.status === 200) {
        // ✅ Navigate directly to homepage (no alert)
        navigate("/homepage");
      } else {
        alert("Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        alert("Invalid username or password.");
      } else {
        alert("Login failed. Please check your credentials or try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google login placeholder
  const handleGoogleLogin = () => {
    alert("Google login clicked");
  };

  const isFormValid = formData.username && formData.password;

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleLogin}>
          {/* Username */}
          <div className="input-group">
            <label className="input-label">Username</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`auth-submit-btn ${isLoading ? "auth-btn-loading" : ""} ${
              !isFormValid ? "auth-btn-disabled" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="auth-btn-spinner"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>Or continue with</span>
        </div>

        {/* Google Login */}
        <button className="google-auth-btn" onClick={handleGoogleLogin}>
          <FcGoogle className="google-icon" />
          Sign in with Google
        </button>

        {/* Footer Links */}
        <div className="login-footer">
          <NavLink to="/forgot-password" className="forgot-password">
            Forgot your password?
          </NavLink>
          <div className="signup-link">
            Don’t have an account? <NavLink to="/signup">Sign up</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
