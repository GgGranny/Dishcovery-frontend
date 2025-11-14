import React from "react";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import logo from "../../assets/logo.png"; // using logo instead of profile pic

const Profile = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Homenavbar />

      {/* PROFILE HEADER */}
      <div className="max-w-6xl mx-auto mt-10 px-5">
        <div className="flex items-start gap-6">

          {/* Profile Logo */}
          <img
            src={logo}
            alt="Profile"
            className="w-28 h-28 rounded-full border object-cover bg-white"
          />

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Aryan Maharjan</h1>
            <p className="text-gray-500 text-sm">@aryan_chef</p>

            <p className="mt-3 leading-relaxed text-sm text-gray-700">
              Passionate home cook and food blogger sharing Mediterranean-inspired recipes.  
              Love experimenting with fresh, seasonal ingredients!
            </p>

            {/* Stats + Website */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <p>📍 Kumaripati, Lalitpur</p>
              <p>📅 Joined 6/15/2023</p>
              <p className="text-green-600 underline cursor-pointer">
                www.aryankitchen.com
              </p>
            </div>

            {/* Followers Stats */}
            <div className="flex gap-10 mt-4 font-semibold">
              <p><span className="text-lg">3</span> Recipes</p>
              <p><span className="text-lg">892</span> Followers</p>
              <p><span className="text-lg">156</span> Following</p>
              <p><span className="text-lg">1247</span> Likes</p>
            </div>
          </div>

          {/* Share Recipe Button */}
          <button className="px-6 py-2 border border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition">
            📤 Share Recipe
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b flex gap-8 text-sm">
          <button className="pb-2 border-b-2 border-green-500 text-green-600 font-medium flex items-center gap-1">
            My Recipes <span className="bg-green-500 text-white px-2 py-0.5 text-xs rounded-full">3</span>
          </button>

          <button className="pb-2 text-gray-500 flex items-center gap-1">
            Saved Recipes <span className="bg-gray-300 text-white px-2 py-0.5 text-xs rounded-full">3</span>
          </button>

          <button className="pb-2 text-gray-500 flex items-center gap-1">
            Liked Recipes <span className="bg-gray-300 text-white px-2 py-0.5 text-xs rounded-full">4</span>
          </button>

          <button className="pb-2 text-gray-500 flex items-center gap-1">
            Activity <span className="bg-gray-300 text-white px-2 py-0.5 text-xs rounded-full">5</span>
          </button>
        </div>

        {/* Recipe Section */}
        <div className="mt-6 flex justify-between items-center">
          <h2 className="font-semibold">My Recipes (3)</h2>

          <button className="px-6 py-2 border border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition">
            ➕ Add New Recipe
          </button>
        </div>

        {/* Placeholder for recipes */}
        <div className="mt-6 text-gray-500 italic">
          (Your recipes will appear here…)
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
