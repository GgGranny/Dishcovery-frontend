import React, { useEffect, useState } from "react";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";

const Profile = () => {
  const username = localStorage.getItem("username") || "User";

  // Load profile image from localStorage
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("profileImageDataUrl") || null
  );

  // Active Tab
  const [activeTab, setActiveTab] = useState("my");

  // Counts for tabs
  const [counts, setCounts] = useState({
    my: 0,
    saved: 0,
    liked: 0,
    activity: 0,
  });

  // Load counts from localStorage
  useEffect(() => {
    setCounts({
      my: JSON.parse(localStorage.getItem("myRecipes") || "[]").length,
      saved: JSON.parse(localStorage.getItem("savedRecipes") || "[]").length,
      liked: JSON.parse(localStorage.getItem("likedRecipes") || "[]").length,
      activity: JSON.parse(localStorage.getItem("activity") || "[]").length,
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProfileImg(base64);
      localStorage.setItem("profileImageDataUrl", base64);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    document.getElementById("profileUpload").click();
  };

  const renderTabContent = () => {
    const dataMap = {
      my: JSON.parse(localStorage.getItem("myRecipes") || "[]"),
      saved: JSON.parse(localStorage.getItem("savedRecipes") || "[]"),
      liked: JSON.parse(localStorage.getItem("likedRecipes") || "[]"),
      activity: JSON.parse(localStorage.getItem("activity") || "[]"),
    };

    return dataMap[activeTab].length > 0 ? (
      <ul className="mt-6 text-gray-700">
        {dataMap[activeTab].map((item, i) => (
          <li key={i}>
            {activeTab === "my" && "🍽 "}
            {activeTab === "saved" && "💾 "}
            {activeTab === "liked" && "❤️ "}
            {activeTab === "activity" && "📝 "}
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-6 text-gray-500 italic">(No items yet)</p>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Homenavbar />

      <div className="max-w-6xl mx-auto mt-10 px-5">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="relative w-28 h-28">
            <img
              src={profileImg || ""}
              alt="Profile"
              className={`w-28 h-28 rounded-full border object-cover cursor-pointer transition hover:opacity-80 ${
                !profileImg ? "bg-gray-200" : ""
              }`}
              onClick={triggerFileSelect}
            />
            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              onClick={triggerFileSelect}
              className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-lg shadow hover:bg-green-700 transition"
            >
              +
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <p className="text-gray-500 text-sm">@{username}</p>
            <h1 className="text-2xl font-semibold">{username}</h1>

            <p className="mt-3 leading-relaxed text-sm text-gray-700">
              Passionate home cook and food blogger sharing Mediterranean-inspired
              recipes. Love experimenting with fresh, seasonal ingredients!
            </p>

            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <p>📍 Kumaripati, Lalitpur</p>
              <p>📅 Joined 6/15/2023</p>
              <p className="text-green-600 underline cursor-pointer">
                www.aryankitchen.com
              </p>
            </div>

            <div className="flex gap-10 mt-4 font-semibold">
              <p>
                <span className="text-lg">{counts.my}</span> Recipes
              </p>
              <p>
                <span className="text-lg">892</span> Followers
              </p>
              <p>
                <span className="text-lg">156</span> Following
              </p>
              <p>
                <span className="text-lg">{counts.liked}</span> Likes
              </p>
            </div>
          </div>

          <button className="px-6 py-2 border border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition">
            📤 Share Recipe
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b flex gap-8 text-sm">
          {["my", "saved", "liked", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 flex items-center gap-1 ${
                activeTab === tab
                  ? "border-b-2 border-green-500 text-green-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {tab === "my" && "My Recipes"}
              {tab === "saved" && "Saved Recipes"}
              {tab === "liked" && "Liked Recipes"}
              {tab === "activity" && "Activity"}
              <span className="bg-gray-300 text-white px-2 py-0.5 text-xs rounded-full ml-1">
                {counts[tab] > 0 ? counts[tab] : ""}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {renderTabContent()}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
