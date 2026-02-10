import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import { FaHeart, FaBookmark, FaRegComment, FaRegPlusSquare } from "react-icons/fa";
import axios from "axios";
import { decodeImage, fetchProfile } from "../../api/Profile";
import { IoPerson } from "react-icons/io5";

const UserProfile = () => {
  const { userId, username: urlUsername } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentUserId = localStorage.getItem("userid");
  const currentUsername = localStorage.getItem("username");
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

  // Set initial username from URL if available
  useEffect(() => {
    if (urlUsername) {
      const decodedUsername = decodeURIComponent(urlUsername);
      setUsername(decodedUsername);
    }
  }, [urlUsername]);

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
        // Fetch user's profile image using userId
        const rs = await fetchProfile(userId);
        if (rs.startsWith("https://")) {
          setProfileImg(rs);
        } else if (rs && rs !== "no user profile") {
          const img = await decodeImage(rs);
          setProfileImg(img);
        } else {
          // Set a default placeholder if no image
          setProfileImg(null);
        }

        // Fetch user's basic info
        try {
          const userRes = await axios.get(
            `http://localhost:8080/api/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          
          const userInfo = userRes.data;
          console.log("User info fetched:", userInfo);
          
          if (userInfo) {
            // Set username from API response (more reliable)
            const apiUsername = userInfo.username || urlUsername;
            setUsername(apiUsername);
            
            setUserData({
              bio: userInfo.bio || "Passionate cook sharing delicious recipes with the community.",
              location: userInfo.location || "Location not specified",
              joinDate: userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : "Recently",
              followers: userInfo.followers || 0,
              following: userInfo.following || 0,
              email: userInfo.email || "",
            });
          }
        } catch (userErr) {
          console.log("User info endpoint not available, using fallback:", userErr.message);
          // Keep using URL username if API fails
        }

        // Fetch user's recipes
        const res = await axios.get(
          `http://localhost:8080/api/recipes/user/r1/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const data = await res.data;
        const recipesData = Array.isArray(data) ? data : [data];
        
        // Extract username from first recipe if not already set
        if (recipesData.length > 0 && recipesData[0].username && !username) {
          setUsername(recipesData[0].username);
        }

        setRecipes(recipesData);
        setCounts(prev => ({ ...prev, recipes: recipesData.length }));

        // Fetch saved recipes from API
        try {
          const savedRes = await axios.get(
            `http://localhost:8080/api/users/${userId}/saved-recipes`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (savedRes.data) {
            setSavedRecipes(savedRes.data);
            setCounts(prev => ({ ...prev, saved: savedRes.data.length }));
          }
        } catch (savedErr) {
          console.log("Saved recipes endpoint not available, using localStorage");
          const savedData = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
          setSavedRecipes(savedData);
          setCounts(prev => ({ ...prev, saved: savedData.length }));
        }

        // Fetch liked recipes from API
        try {
          const likedRes = await axios.get(
            `http://localhost:8080/api/users/${userId}/liked-recipes`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (likedRes.data) {
            setLikedRecipes(likedRes.data);
            setCounts(prev => ({ ...prev, liked: likedRes.data.length }));
          }
        } catch (likedErr) {
          console.log("Liked recipes endpoint not available, using localStorage");
          const likedData = JSON.parse(localStorage.getItem("likedRecipes") || "[]");
          setLikedRecipes(likedData);
          setCounts(prev => ({ ...prev, liked: likedData.length }));
        }

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
        
        // Use URL username as fallback
        if (urlUsername) {
          setUsername(decodeURIComponent(urlUsername));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token, urlUsername]);

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
      className="bg-white rounded-lg overflow-hidden border border-gray-300 hover:shadow-lg cursor-pointer transition min-h-[200px]"
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
    if (loading) return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
    
    if (error) return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );

    const dataMap = {
      recipes: recipes,
      saved: savedRecipes,
      liked: likedRecipes,
    };

    const data = dataMap[activeTab];
    
    if (!data || data.length === 0) {
      return (
        <div className="mt-6 text-center py-12 bg-gray-50 rounded-lg min-h-[400px] flex items-center justify-center">
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

    // Handle single recipe - center it
    if (data.length === 1) {
      return (
        <div className="flex justify-center items-start pt-10">
          <div className="w-full max-w-sm">
            {renderCard(data[0], activeTab === "recipes")}
          </div>
        </div>
      );
    }

    // Handle 2 recipes - use 2-column grid
    if (data.length === 2) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {data.map((item) => renderCard(item, activeTab === "recipes"))}
        </div>
      );
    }

    // Handle 3 or more recipes - use 3-column grid
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

  // Edit profile function
  const handleEditProfile = () => {
    navigate(`/edit-profile/${userId}`);
  };

  // Handle follow/unfollow
  const handleFollow = () => {
    if (!token) {
      alert("Please login to follow users");
      navigate("/login");
      return;
    }
    
    // Implement follow functionality here
    alert(`Follow functionality for ${username} would be implemented here`);
  };

  // Handle share recipe
  const handleShareRecipe = () => {
    if (isOwnProfile) {
      navigate("/create-recipe");
    } else {
      // Share this user's profile
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert("Profile link copied to clipboard!");
    }
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

      <div className="max-w-6xl mx-auto mt-10 px-5 mb-20 w-full">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-28 h-28 mx-auto sm:mx-0">
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
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-sm truncate">@{username}</p>
                <h1 className="text-2xl font-semibold truncate">{username}</h1>
                {userData?.email && (
                  <p className="text-sm text-gray-600 mt-1 truncate">{userData.email}</p>
                )}
              </div>
              
              <div className="flex gap-3 flex-shrink-0">
                {isOwnProfile ? (
                  <>
                    <button 
                      onClick={handleEditProfile}
                      className="px-4 sm:px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition text-sm sm:text-base whitespace-nowrap"
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={handleViewOwnProfile}
                      className="px-4 sm:px-6 py-2 border border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition text-sm sm:text-base whitespace-nowrap"
                    >
                      My Profile
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleFollow}
                    className="px-4 sm:px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition text-sm sm:text-base whitespace-nowrap"
                  >
                    Follow
                  </button>
                )}
                <button 
                  onClick={handleShareRecipe}
                  className="px-4 sm:px-6 py-2 border border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition text-sm sm:text-base whitespace-nowrap"
                >
                  {isOwnProfile ? "📤 Share Recipe" : "📤 Share Profile"}
                </button>
              </div>
            </div>

            <p className="mt-3 leading-relaxed text-sm text-gray-700 line-clamp-3">
              {userData?.bio || "Passionate cook sharing delicious recipes with the community."}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                📍 {userData?.location || "Location not specified"}
              </p>
              <p className="flex items-center gap-1">
                📅 Joined {userData?.joinDate || "Recently"}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 sm:gap-10 mt-4 font-semibold">
              <p className="flex flex-col sm:flex-row items-center sm:items-start gap-1">
                <span className="text-lg">{counts.recipes}</span>
                <span className="text-sm text-gray-600">Recipes</span>
              </p>
              <p className="flex flex-col sm:flex-row items-center sm:items-start gap-1">
                <span className="text-lg">{userData?.followers || 0}</span>
                <span className="text-sm text-gray-600">Followers</span>
              </p>
              <p className="flex flex-col sm:flex-row items-center sm:items-start gap-1">
                <span className="text-lg">{userData?.following || 0}</span>
                <span className="text-sm text-gray-600">Following</span>
              </p>
              <p className="flex flex-col sm:flex-row items-center sm:items-start gap-1">
                <span className="text-lg">{counts.liked}</span>
                <span className="text-sm text-gray-600">Likes</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b flex gap-4 sm:gap-8 text-sm overflow-x-auto">
          {["recipes", "saved", "liked"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 flex items-center gap-1 flex-shrink-0 ${activeTab === tab
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