import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiBook,
  FiMessageSquare,
  FiStar,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { HiChartBar } from "react-icons/hi";
import dishcoveryLogo from "../../assets/logo.png"; // Update this path to your actual logo

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { path: "/admin", icon: <FiHome />, label: "Dashboard", exact: true },
    { path: "/admin/users", icon: <FiUsers />, label: "Users" },
    { path: "/admin/adminrecipes", icon: <FiBook />, label: "Recipes" },
    { path: "/admin/discussions", icon: <FiMessageSquare />, label: "Discussions" },
    { path: "/admin/reviews", icon: <FiStar />, label: "Reviews" },
    { path: "/admin/analytics", icon: <HiChartBar />, label: "Analytics" },
    { path: "/admin/adminsetting", icon: <FiSettings />, label: "Settings" },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className={`flex items-center ${sidebarOpen ? "justify-start" : "justify-center"} w-full`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center overflow-hidden shadow-md">
            {dishcoveryLogo ? (
              <img 
                src={dishcoveryLogo} 
                alt="Dishcovery Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">D</span>
            )}
          </div>
          {sidebarOpen && (
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-800">Dishcovery</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-2 p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="mb-4 px-2">
          {/* {sidebarOpen && (
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </h2>
          )} */}
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-green-50 text-green-700 font-semibold border-l-4 border-green-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`
                }
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className={`text-xl ${
                  hoveredItem === item.path ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${sidebarOpen ? "p-3" : "p-2 justify-center"}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow">
            <span className="text-white font-bold">A</span>
          </div>
          {sidebarOpen && (
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-800">Admin User</p>
              <p className="text-sm text-gray-500 truncate">admin@gmail.com</p>
              <div className="mt-1">
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Admin
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;