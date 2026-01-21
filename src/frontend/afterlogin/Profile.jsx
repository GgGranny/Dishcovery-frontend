import React, { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import { FaHeart, FaBookmark, FaRegComment, FaRegPlusSquare } from "react-icons/fa"; // Icons for activity
import axios from "axios";
import { decodeImage, fetchProfile } from "../../api/Profile";
import { IoPerson } from "react-icons/io5";

const Profile = () => {
  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userid");
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState(null);

  const [activeTab, setActiveTab] = useState("my");

  const [counts, setCounts] = useState({
    my: 0,
    saved: 0,
    liked: 0,
    activity: 0,
  });

  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [activity, setActivity] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function userPrfoileFetch() {
      const rs = await fetchProfile(userId);
      if (rs.startsWith("https://")) {
        setProfileImg(rs);
        return;
      }
      console.log(rs);
      const img = await decodeImage(rs);
      setProfileImg(img);
    }
    console.log(userId);
    if (userId) {
      userPrfoileFetch(userId);
    }

  }, [userId]);

  // Upload Profile Image
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    const data = new FormData();
    data.append("file", file);
    if (!file) return;
    try {
      const response = await axios.post(`http://localhost:8080/upload/profile/${Number(userId)}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        },
      );
      const rs = await fetchProfile(userId);
      const url = await decodeImage(rs);
      setProfileImg(url);
    } catch (error) {
      console.log(error);
    }
  };


  const triggerFileSelect = () => {
    document.getElementById("profileUpload").click();
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !userId) return;

      setLoading(true);

      try {
        // Fetch My Recipes
        const res = await fetch(
          `http://localhost:8080/api/recipes/user/r1/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        const myData = Array.isArray(data) ? data : [data];
        setMyRecipes(myData);

        // For demo, using localStorage for saved/liked recipes and activity
        const savedData = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        const likedData = JSON.parse(localStorage.getItem("likedRecipes") || "[]");
        let activityData = JSON.parse(localStorage.getItem("activity") || "[]");

        setSavedRecipes(savedData);
        setLikedRecipes(likedData);
        setActivity(activityData);

        setCounts({
          my: myData.length,
          saved: savedData.length,
          liked: likedData.length,
          activity: activityData.length,
        });
      } catch (err) {
        console.error("Error fetching user recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, userId]);

  const renderStars = (rating = 4) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
      </div>
    );
  };

  const renderCard = (recipe) => (
    <div
      key={recipe.recipeId || recipe.id || Math.random()}
      className="bg-white rounded-lg overflow-hidden border border-gray-300 hover:shadow-lg cursor-pointer transition"
      onClick={() => navigate(`/aboutrecipes/${recipe.recipeId || recipe.id}`)}
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={
            recipe.thumbnail
              ? `data:image/jpeg;base64,${recipe.thumbnail}`
              : "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={recipe.recipeName || "Recipe"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            {recipe.recipeName || "Unnamed Recipe"}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            {renderStars(recipe.rating || 4)}
            <span>{recipe.rating || 4}</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {recipe.description || "No description available."}
        </p>
        <div className="flex justify-between items-center text-[10px] text-gray-500">
          <span>{recipe.difficulty || "Easy"}</span>
          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] rounded">
            {recipe.category || "Recipe"}
          </span>
        </div>
      </div>
    </div>
  );

  // Map activity type to icon
  const getActivityIcon = (type) => {
    switch (type) {
      case "like":
        return <FaHeart className="text-red-500" />;
      case "comment":
        return <FaRegComment className="text-blue-500" />;
      case "saved":
        return <FaBookmark className="text-green-500" />;
      case "posted":
        return <FaRegPlusSquare className="text-purple-500" />;
      default:
        return <FaRegPlusSquare className="text-gray-400" />;
    }
  };

  const renderTabContent = () => {
    if (loading) return <p className="mt-6 text-gray-500">Loading...</p>;

    if (activeTab === "activity") {
      return activity.length > 0 ? (
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
          {activity.map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex items-start gap-4 hover:bg-green-50 transition"
            >
              <div className="mt-1">{getActivityIcon(item.type)}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-gray-600 text-sm mt-1">{item.subtitle}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">(No activity yet)</p>
      );
    }

    const dataMap = {
      my: myRecipes,
      saved: savedRecipes,
      liked: likedRecipes,
    };

    return dataMap[activeTab] && dataMap[activeTab].length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {dataMap[activeTab].map((item) => renderCard(item))}
      </div>
    ) : (
      <p className="mt-6 text-gray-500 italic">(No items yet)</p>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Homenavbar />

      <div className="max-w-6xl mx-auto mt-10 px-5 mb-20">
        <div className="flex items-start gap-6">
          <div className="relative w-28 h-28">
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                className={`w-28 h-28 rounded-full border object-cover cursor-pointer transition hover:opacity-80 ${!profileImg ? "bg-gray-200" : ""
                  }`}
                onClick={triggerFileSelect}
              />
            ) : (
              <IoPerson />
            )}
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
              className={`pb-2 flex items-center gap-1 ${activeTab === tab
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

        {/* Tab Content with consistent min-height */}
        <div className="mt-6 min-h-[450px]">{renderTabContent()}</div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
