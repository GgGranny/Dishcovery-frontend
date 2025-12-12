import React, { useEffect, useState } from "react";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";

const Profile = () => {
  const username = localStorage.getItem("username") || "User";
  const [profileImg, setProfileImg] = useState(localStorage.getItem("profileImageDataUrl") || null);
  const [activeTab, setActiveTab] = useState("my");
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [activity, setActivity] = useState([]);

  // Counts
  const counts = {
    my: recipes.length,
    saved: savedRecipes.length,
    liked: likedRecipes.length,
    activity: activity.length,
  };

  // Fetch user's recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("token"); // if your API needs auth
        const res = await fetch("http://localhost:8080/api/recipes/recipe/r1/2", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch recipes");

        const data = await res.json();
        setRecipes(data); // assuming API returns array of recipes
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipes();

    // Load saved, liked, and activity from localStorage or API
    setSavedRecipes(JSON.parse(localStorage.getItem("savedRecipes") || "[]"));
    setLikedRecipes(JSON.parse(localStorage.getItem("likedRecipes") || "[]"));
    setActivity(JSON.parse(localStorage.getItem("activity") || "[]"));
  }, []);

  // Upload Profile Image
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

  // Render active tab content
  const renderTabContent = () => {
    if (activeTab === "my") {
      return recipes.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white p-4 border rounded-lg shadow hover:shadow-md">
              <img
                src={recipe.imageUrl} // adjust according to your API field
                alt={recipe.title}
                className="h-40 w-full object-cover rounded-lg mb-2"
              />
              <h3 className="font-semibold text-gray-800">{recipe.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{recipe.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-500 italic">(You have not uploaded any recipes yet)</p>
      );
    }

    if (activeTab === "saved") {
      return savedRecipes.length > 0 ? (
        <ul className="mt-6 text-gray-700">{savedRecipes.map((item, i) => <li key={i}>💾 {item}</li>)}</ul>
      ) : <p className="mt-6 text-gray-500 italic">(No saved recipes)</p>;
    }

    if (activeTab === "liked") {
      return likedRecipes.length > 0 ? (
        <ul className="mt-6 text-gray-700">{likedRecipes.map((item, i) => <li key={i}>❤️ {item}</li>)}</ul>
      ) : <p className="mt-6 text-gray-500 italic">(No liked recipes)</p>;
    }

    if (activeTab === "activity") {
      return activity.length > 0 ? (
        <div className="mt-6 flex flex-col gap-4">
          {activity.map((item, i) => (
            <div key={i} className="bg-white shadow-md rounded-lg p-4 border flex flex-col sm:flex-row sm:justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-600 text-sm mt-1">{item.subtitle}</p>
              </div>
              <p className="text-gray-400 text-xs mt-2 sm:mt-0">{item.date}</p>
            </div>
          ))}
        </div>
      ) : <p className="mt-6 text-gray-500 italic">(No activity yet)</p>;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Homenavbar />

      <div className="flex-1 max-w-6xl mx-auto mt-10 px-5 pb-20">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="relative w-28 h-28">
            <img
              src={profileImg || ""}
              alt="Profile"
              className={`w-28 h-28 rounded-full border object-cover cursor-pointer transition hover:opacity-80 ${!profileImg ? "bg-gray-200" : ""}`}
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
            <div className="flex gap-10 mt-4 font-semibold">
              <p><span className="text-lg">{counts.my}</span> Recipes</p>
              <p><span className="text-lg">892</span> Followers</p>
              <p><span className="text-lg">156</span> Following</p>
              <p><span className="text-lg">{counts.liked}</span> Likes</p>
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
              className={`pb-2 flex items-center gap-1 ${activeTab === tab ? "border-b-2 border-green-500 text-green-600 font-medium" : "text-gray-500"}`}
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
