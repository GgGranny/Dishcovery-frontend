import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import "../css/Signup.css";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
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
      console.log("✅ Signup Response:", data);

      if (response.ok) {
       
        setShowSuccessModal(true);
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error during signup:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/"); 
  };

  const isFormValid =
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Sign up to get started with your account</p>
        </div>

        <form className="signup-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Enter your username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

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

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

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
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>Or continue with</span>
        </div>

        <button className="google-auth-btn" onClick={handleGoogleSignup}>
          <FcGoogle className="google-icon" />
          Sign up with Google
        </button>

        <div className="signup-footer">
          Already have an account? <NavLink to="/login">Sign in</NavLink>
        </div>
      </div>

   
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Signup Successful </h2>
            <p>Your account has been created successfully.</p>
            <button className="modal-ok-btn" onClick={handleModalClose}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
