import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX, HiUser, HiSparkles } from "react-icons/hi";
import { decodeImage, fetchProfile } from "../api/Profile";

const Homenavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const userId = localStorage.getItem("userid");
  const [profileImg, setProfileImg] = useState("" || null);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    async function fetchUserProfile() {
      const rs = await fetchProfile(userId);
      const img = await decodeImage(rs);
      setProfileImg(img);
    }
    fetchUserProfile();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 GLOBAL ACTIVE LINK STYLE
  const activeClass = "text-green-600 font-semibold";

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center py-4 px-4">
        {/* LEFT: Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo(0, 0)}
        >
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-gray-800">Dishcovery</span>
        </div>

        {/* CENTER NAV (Desktop) */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <NavLink
            to="/homepage"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) =>
              isActive ? activeClass : "text-gray-700 hover:text-green-600"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/recipes"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) =>
              isActive ? activeClass : "text-gray-700 hover:text-green-600"
            }
          >
            Recipes
          </NavLink>

          <NavLink
            to="/community"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) =>
              isActive ? activeClass : "text-gray-700 hover:text-green-600"
            }
          >
            Community
          </NavLink>

          <NavLink
            to="/aboutus"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) =>
              isActive ? activeClass : "text-gray-700 hover:text-green-600"
            }
          >
            About
          </NavLink>
        </nav>

        {/* RIGHT (Desktop) */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {/* Premium Button - Updated to Green Premium Style */}
          <NavLink
            to="/premium"
            onClick={() => window.scrollTo(0, 0)}
            className="group flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            {/* Shiny effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Gold-like border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            
            <HiSparkles className="text-lg text-yellow-200 relative z-10" />
            <span className="relative z-10 font-semibold">Premium</span>
          </NavLink>

          <NavLink
            to="/uploadrecipes"
            onClick={() => window.scrollTo(0, 0)}
            className="px-5 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Create
          </NavLink>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center border bg-white overflow-hidden hover:shadow-sm transition"
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <HiUser className="text-xl text-gray-700" />
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl overflow-hidden border">
                <NavLink
                  to="/profile"
                  onClick={() => window.scrollTo(0, 0)}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  My Profile
                </NavLink>

                <NavLink
                  to="/setting"
                  onClick={() => window.scrollTo(0, 0)}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  Settings
                </NavLink>

                <NavLink
                  to="/saved"
                  onClick={() => window.scrollTo(0, 0)}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  Saved Recipes
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE SECTION */}
        <div className="ml-auto md:hidden flex items-center gap-2">
          {/* Mobile Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setMenuOpen(false);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center border bg-white overflow-hidden"
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <HiUser className="text-lg text-gray-700" />
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white shadow-lg rounded-xl overflow-hidden border z-50">
                <NavLink
                  to="/profile"
                  onClick={() => {
                    setProfileOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  My Profile
                </NavLink>

                <NavLink
                  to="/setting"
                  onClick={() => {
                    setProfileOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  Settings
                </NavLink>

                <NavLink
                  to="/saved"
                  onClick={() => {
                    setProfileOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  Saved Recipes
                </NavLink>

                <NavLink
                  to="/premium"
                  onClick={() => {
                    setProfileOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className="block px-4 py-3 hover:bg-gray-100 border-t"
                >
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    <HiSparkles className="text-emerald-500" />
                    Premium Features
                  </div>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-3xl text-gray-700"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setProfileOpen(false);
            }}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div>
          <div className="flex items-center gap-3 pt-4 border-t px-4">
            {/* Mobile Premium Button - Updated */}
            <NavLink
              to="/premium"
              onClick={() => {
                setMenuOpen(false);
                window.scrollTo(0, 0);
              }}
              className="group flex items-center gap-2 flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-medium shadow-lg justify-center relative overflow-hidden"
            >
              {/* Shiny effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <HiSparkles className="text-lg text-yellow-200 relative z-10" />
              <span className="relative z-10 font-semibold">Premium</span>
            </NavLink>

            <NavLink
              to="/uploadrecipes"
              onClick={() => {
                setMenuOpen(false);
                window.scrollTo(0, 0);
              }}
              className="flex-1 px-4 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition text-center"
            >
              Create
            </NavLink>
          </div>

          <div className="md:hidden bg-white shadow-lg p-6 space-y-4">
            <div className="flex flex-col gap-3 text-lg">
              <NavLink
                to="/homepage"
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  isActive ? activeClass : "text-gray-700"
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/recipes"
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  isActive ? activeClass : "text-gray-700"
                }
              >
                Recipes
              </NavLink>

              <NavLink
                to="/community"
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  isActive ? activeClass : "text-gray-700"
                }
              >
                Community
              </NavLink>

              <NavLink
                to="/aboutus"
                onClick={() => {
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  isActive ? activeClass : "text-gray-700"
                }
              >
                About
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Homenavbar;