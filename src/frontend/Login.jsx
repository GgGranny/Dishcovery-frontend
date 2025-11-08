import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import "../css/Login.css";
import "../frontend/Homepage";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // send email + password
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("✅ Login success:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/homepage"); 
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("❌ Error logging in:", error);
      alert("Something went wrong during login.");
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`auth-submit-btn ${
              isLoading ? "auth-btn-loading" : ""
            } ${!isFormValid ? "auth-btn-disabled" : ""}`}
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

        <div className="login-divider">
          <span>Or continue with</span>
        </div>

        <button className="google-auth-btn" onClick={handleGoogleLogin}>
          <FcGoogle className="google-icon" />
          Sign in with Google
        </button>

        <div className="login-footer">
          <NavLink to="/forgot-password" className="forgot-password">
            Forgot your password?
          </NavLink>
          <div className="signup-link">
            Don't have an account? <NavLink to="/signup">Sign up</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
