import React from 'react';
import '../css/Navbar.css';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  return (
    <header className="header">
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Discovery Logo" className="logo-image" />
          <span className="logo-text">Discovery</span>
        </div>

        <nav className="nav">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Recipes</a>
          <a href="#" className="nav-link">Categories</a>
          <a href="#" className="nav-link">Community</a>
          <a href="#" className="nav-link">About</a>
        </nav>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search recipes..." 
            className="search-input"
          />
          <button className="create-btn">Create</button>
          <button className="login-btn">Login</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
