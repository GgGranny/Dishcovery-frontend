import React, { useState } from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX, HiUser } from "react-icons/hi";

const Homenavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center py-4 px-4">

        {/* LEFT: Logo + Brand */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-gray-800">Discovery</span>
        </div>

        {/* CENTER: Nav (centered on md+) */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <NavLink to="/homepage" className="nav-link">Home</NavLink>
          <NavLink to="/recipes" className="nav-link">Recipes</NavLink>
          <NavLink to="/categories" className="nav-link">Categories</NavLink>
          <NavLink to="/community" className="nav-link">Community</NavLink>
          <NavLink to="/aboutus" className="nav-link">About</NavLink>
        </nav>

        {/* RIGHT (desktop): Create + Profile */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <button className="px-5 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition">
            Create
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center border bg-white hover:shadow-sm transition"
              aria-label="Open account menu"
            >
              <HiUser className="text-xl text-gray-700" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl overflow-hidden border">
                <NavLink
                  to="/profile"
                  className="block px-4 py-3 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className="block px-4 py-3 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  Settings
                </NavLink>
                <NavLink
                  to="/saved"
                  className="block px-4 py-3 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  Saved Recipes
                </NavLink>
                <NavLink
                  to="/"
                  className="block px-4 py-3 text-red-600 hover:bg-red-50"
                  onClick={() => setProfileOpen(false)}
                >
                  Logout
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE: profile icon (left of hamburger) + hamburger */}
        <div className="ml-auto md:hidden flex items-center gap-2">
          {/* mobile profile icon */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setMenuOpen(false); // close main menu if open
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center border bg-white hover:shadow-sm transition"
              aria-label="Open account menu"
            >
              <HiUser className="text-lg text-gray-700" />
            </button>

            {/* Mobile profile dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white shadow-lg rounded-xl overflow-hidden border z-50">
                <NavLink
                  to="/profile"
                  className="block px-4 py-3 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className="block px-4 py-3 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  Settings
                </NavLink>
                <NavLink
                  to="/saved"
                  className="block px-4 py-3 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  Saved Recipes
                </NavLink>
                <NavLink
                  to="/"
                  className="block px-4 py-3 text-red-600 hover:bg-red-50"
                  onClick={() => setProfileOpen(false)}
                >
                  Logout
                </NavLink>
              </div>
            )}
          </div>

          {/* hamburger */}
          <button
            className="text-3xl text-gray-700"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setProfileOpen(false); // close profile if open
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (hamburger content) */}
      {menuOpen && (
        <div>
           <div className="flex items-center justify-between pt-4 border-t">
            <button
              className="px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
              onClick={() => setMenuOpen(false)}
            >
              Create
            </button>
         

            </div>
        <div className="md:hidden bg-white shadow-lg p-6 space-y-4">
          <div className="flex flex-col gap-3 text-lg">
            <NavLink to="/homepage" onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/recipes" onClick={() => setMenuOpen(false)}>Recipes</NavLink>
            <NavLink to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink>
            <NavLink to="/community" onClick={() => setMenuOpen(false)}>Community</NavLink>
            <NavLink to="/aboutus" onClick={() => setMenuOpen(false)}>About</NavLink>
          </div>

       
          </div>
        </div>
      )}
    </header>
  );
};

export default Homenavbar;
