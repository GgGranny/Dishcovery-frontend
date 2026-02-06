import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import { FaHeart, FaBookmark, FaRegComment, FaRegPlusSquare } from "react-icons/fa";
import axios from "axios";
import { decodeImage, fetchProfile } from "../../api/Profile";
import { IoPerson } from "react-icons/io5";

const UserProfile = () => {
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate();
  
  const currentUserId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [profileImg, setProfileImg] = useState(null);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("recipes");
  const [counts, setCounts] = useState({
    recipes: 0,
    saved: 0,
    liked: 0,
  });

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);

  // Check if this is the current user's own profile
  useEffect(() => {
    if (userId && currentUserId) {
      setIsOwnProfile(userId === currentUserId);
    }
  }, [userId, currentUserId]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) {
        setError("User not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch user's profile image
        const rs = await fetchProfile(userId);
        if (rs.startsWith("https://")) {
          setProfileImg(rs);
        } else if (rs && rs !== "no user profile") {
          const img = await decodeImage(rs);
          setProfileImg(img);
        }

        // Fetch user's basic info (you might need to create this endpoint)
        // For now, we'll fetch recipes to get username
        const res = await axios.get(
          `http://localhost:8080/api/recipes/user/r1/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const data = await res.data;
        const recipesData = Array.isArray(data) ? data : [data];
        
        // Extract username from first recipe (if available)
        if (recipesData.length > 0 && recipesData[0].username) {
          setUsername(recipesData[0].username);
        } else {
          // Fallback to fetching user info from a separate endpoint
          try {
            const userRes = await axios.get(
              `http://localhost:8080/api/users/${userId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (userRes.data && userRes.data.username) {
              setUsername(userRes.data.username);
            }
          } catch (userErr) {
            console.log("User info endpoint not available, using fallback");
            setUsername(`User${userId.slice(0, 4)}`);
          }
        }

        setRecipes(recipesData);
        setCounts(prev => ({ ...prev, recipes: recipesData.length }));

        // For demo, using localStorage for saved/liked (in real app, fetch from API)
        const savedData = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        const likedData = JSON.parse(localStorage.getItem("likedRecipes") || "[]");

        setSavedRecipes(savedData.slice(0, 6)); // Limit to 6 for display
        setLikedRecipes(likedData.slice(0, 6)); // Limit to 6 for display
        
        setCounts(prev => ({
          ...prev,
          saved: savedData.length,
          liked: likedData.length,
        }));

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token]);

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

  const renderCard = (recipe, showCategory = true) => (
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
          {showCategory && recipe.category && (
            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] rounded">
              {recipe.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (loading) return <p className="mt-6 text-gray-500">Loading...</p>;
    if (error) return <p className="mt-6 text-red-500">{error}</p>;

    const dataMap = {
      recipes: recipes,
      saved: savedRecipes,
      liked: likedRecipes,
    };

    const data = dataMap[activeTab];
    
    if (!data || data.length === 0) {
      return (
        <div className="mt-6 text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 italic">
            {activeTab === "recipes" 
              ? "This user hasn't posted any recipes yet."
              : activeTab === "saved"
              ? "This user hasn't saved any recipes yet."
              : "This user hasn't liked any recipes yet."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data.map((item) => renderCard(item, activeTab === "recipes"))}
      </div>
    );
  };

  // Go back to own profile if this is the current user
  const handleViewOwnProfile = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Homenavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Homenavbar />

      <div className="max-w-6xl mx-auto mt-10 px-5 mb-20">
        {/* Profile Header */}
        <div className="flex items-start gap-6">
          <div className="relative w-28 h-28">
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                className="w-28 h-28 rounded-full border object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                <IoPerson className="text-green-600 text-4xl" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">@{username}</p>
                <h1 className="text-2xl font-semibold">{username}</h1>
              </div>
              
              {isOwnProfile && (
                <button 
                  onClick={handleViewOwnProfile}
                  className="px-6 py-2 border border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition"
                >
                  View My Full Profile
                </button>
              )}
            </div>

            <p className="mt-3 leading-relaxed text-sm text-gray-700">
              {userData?.bio || "Passionate cook sharing delicious recipes with the community."}
            </p>

            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <p>📍 {userData?.location || "Location not specified"}</p>
              <p>📅 Joined {userData?.joinDate || "Recently"}</p>
            </div>

            <div className="flex gap-10 mt-4 font-semibold">
              <p>
                <span className="text-lg">{counts.recipes}</span> Recipes
              </p>
              <p>
                <span className="text-lg">{userData?.followers || 0}</span> Followers
              </p>
              <p>
                <span className="text-lg">{userData?.following || 0}</span> Following
              </p>
              <p>
                <span className="text-lg">{counts.liked}</span> Likes
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b flex gap-8 text-sm">
          {["recipes", "saved", "liked"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 flex items-center gap-1 ${activeTab === tab
                ? "border-b-2 border-green-500 text-green-600 font-medium"
                : "text-gray-500"
                }`}
            >
              {tab === "recipes" && "Recipes"}
              {tab === "saved" && "Saved Recipes"}
              {tab === "liked" && "Liked Recipes"}
              <span className="bg-gray-300 text-white px-2 py-0.5 text-xs rounded-full ml-1">
                {counts[tab] > 0 ? counts[tab] : ""}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 min-h-[450px]">
          {renderTabContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;