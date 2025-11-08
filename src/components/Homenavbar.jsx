import React from 'react';
import '../css/Navbar.css';
import logo from '../assets/logo.png';
import { NavLink } from 'react-router-dom';

const Homenavbar = () => {
  return (
    <header className="header">
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Discovery Logo" className="logo-image" />
          <span className="logo-text">Discovery</span>
        </div>

        <nav className="nav">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/recipes" className="nav-link">Recipes</NavLink>
          <NavLink to="/categories" className="nav-link">Categories</NavLink>
          <NavLink to="/community" className="nav-link">Community</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
        </nav>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search recipes..."
            className="search-input"
          />
          <button className="create-btn">Create</button>

          <NavLink to="/">
            <button className="login-btn">Logout</button>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Homenavbar;
