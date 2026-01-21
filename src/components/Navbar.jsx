import React, { useState } from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-green-600">Dishcovery</span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink className="nav-link" to="/">Home</NavLink>
          <NavLink className="nav-link" to="/communities">Community</NavLink>
          <NavLink className="nav-link" to="/about">About</NavLink>
        </nav>

        {/* Desktop Login Button */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/login">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Login
            </button>
          </NavLink>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl text-gray-700"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-6 py-5 space-y-4">
          {/* Nav Links */}
          <div className="flex flex-col gap-3 text-lg">
            <NavLink className="mobile-link" to="/" onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink className="mobile-link" to="/communities" onClick={() => setOpen(false)}>Community</NavLink>
            <NavLink className="mobile-link" to="/about" onClick={() => setOpen(false)}>About</NavLink>
          </div>

          {/* Mobile Login Button */}
          <div>
            <NavLink to="/login">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Login
              </button>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
