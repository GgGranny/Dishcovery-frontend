import React, { useState, useEffect } from "react";
import axios from "axios";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import recipeBg from "../../assets/recipe-bg.png";
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageNo] = useState(1);

  // Separate states for categories (Veg/Non-Veg) and cuisines (Newari, Tharu, etc.)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fixed cuisine list
  const CUISINE_LIST = [
    "Newari",
    "Tharu",
    "Thakali",
    "Kirati",
    "Magar",
    "Tamang",
    "Doteli",
    "Tibetan",
    "Mithila",
    "National-Style",
    "Nepali",
  ];

  // Fixed category list
  const CATEGORY_LIST = ["Veg", "Non-Veg"];

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/api/recipes/recipe?page=${pageNo}&size=${5}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Handle different response structures
        let recipesArray = [];
        if (Array.isArray(res.data)) {
          recipesArray = res.data;
        } else if (res.data.content) {
          recipesArray = res.data.content;
        } else if (res.data.recipes) {
          recipesArray = res.data.recipes;
        } else {
          recipesArray = [res.data];
        }

        console.log("Fetched recipes:", recipesArray);
        setRecipes(recipesArray);
        setFilteredRecipes(recipesArray);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Your session expired. Please log in again.");
        } else {
          setError("Failed to load recipes.");
        }
        console.error("Error fetching recipes:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token, pageNo]);

  // Apply filters
  useEffect(() => {
    console.log("Selected Categories:", selectedCategories);
    console.log("Selected Cuisines:", selectedCuisines);
    console.log("Selected Difficulty:", selectedDifficulty);

    let filtered = [...recipes];

    // Filter by category (Veg/Non-Veg)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.category && selectedCategories.includes(recipe.category)
      );
      console.log("After category filter:", filtered.length);
    }

    // Filter by cuisine
    if (selectedCuisines.length > 0) {
      filtered = filtered.filter((recipe) => {
        // First check if recipe has cuisine property
        if (recipe.cuisine) {
          return selectedCuisines.includes(recipe.cuisine);
        }
        // If no cuisine property, check if category matches any cuisine
        if (recipe.category) {
          return selectedCuisines.includes(recipe.category);
        }
        return false;
      });
      console.log("After cuisine filter:", filtered.length);
    }

    // Filter by difficulty
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.difficulty && selectedDifficulty.includes(recipe.difficulty)
      );
      console.log("After difficulty filter:", filtered.length);
    }

    setFilteredRecipes(filtered);
  }, [selectedCategories, selectedCuisines, selectedDifficulty, recipes]);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle cuisine selection
  const handleCuisineChange = (cuisine) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisine)) {
        return prev.filter(c => c !== cuisine);
      } else {
        return [...prev, cuisine];
      }
    });
  };

  // Handle difficulty selection
  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(prev => {
      if (prev.includes(difficulty)) {
        return prev.filter(d => d !== difficulty);
      } else {
        return [...prev, difficulty];
      }
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedCuisines([]);
    setSelectedDifficulty([]);
  };

  // Check if any filter is active
  const isFilterActive = selectedCategories.length > 0 ||
    selectedCuisines.length > 0 ||
    selectedDifficulty.length > 0;

  // Function to render star ratings
  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Homenavbar />

      {/* Banner */}
      <div
        className="relative w-full h-[220px] bg-cover bg-center"
        style={{ backgroundImage: `url(${recipeBg})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Discover Amazing Recipes</h1>
          <p className="text-base">Explore delicious recipes from our community</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 py-8 px-5">
        {/* Filters Sidebar */}
        <div className="col-span-3 space-y-5">
          {/* Active Filters Display */}
          {isFilterActive && (
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-green-800 text-sm">Active Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-green-600 hover:text-green-800"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(cat => (
                  <span key={cat} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {cat}
                  </span>
                ))}
                {selectedCuisines.map(cuisine => (
                  <span key={cuisine} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {cuisine}
                  </span>
                ))}
                {selectedDifficulty.map(diff => (
                  <span key={diff} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {diff}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm">Category</h2>
            <div className="space-y-2">
              {CATEGORY_LIST.map((category) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-green-600 cursor-pointer"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-green-700">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm">Cuisine</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {CUISINE_LIST.map((cuisine) => (
                <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-green-600 cursor-pointer"
                    checked={selectedCuisines.includes(cuisine)}
                    onChange={() => handleCuisineChange(cuisine)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-green-700">
                    {cuisine}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm">Difficulty</h2>
            <div className="space-y-2">
              {["Easy", "Medium", "Hard"].map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-green-600 cursor-pointer"
                    checked={selectedDifficulty.includes(item)}
                    onChange={() => handleDifficultyChange(item)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-green-700">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            className="px-4 py-2.5 bg-white text-gray-700 rounded-lg text-sm w-full hover:bg-gray-50 transition-all font-medium"
            onClick={resetFilters}
          >
            Reset All Filters
          </button>
        </div>

        {/* Recipe Cards */}
        <div className="col-span-9">
          {/* Header with count */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {isFilterActive
                ? `Filtered Recipes (${filteredRecipes.length})`
                : "All Recipes"}
            </h2>
            <span className="text-sm text-gray-500">
              {isFilterActive
                ? `Showing ${filteredRecipes.length} of ${recipes.length} recipes`
                : `Total ${recipes.length} recipes`}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-3 text-gray-600">Loading recipes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center mt-10 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-500 hover:text-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center mt-10 p-8 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg mb-2">No recipes found</p>
              <p className="text-gray-500 text-sm mb-4">
                {isFilterActive
                  ? "No recipes match your selected filters"
                  : "No recipes available yet"}
              </p>
              {isFilterActive && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.recipeId}
                  className="bg-white rounded-lg overflow-hidden border border-gray-400 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/aboutrecipes/${recipe.recipeId}`)}
                >
                  {/* Recipe Image */}
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={
                        recipe.thumbnail
                          ? `data:image/jpeg;base64,${recipe.thumbnail}`
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Recipe Content */}
                  <div className="p-3">
                    {/* Title and Rating */}
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {recipe.recipeName}
                      </h3>
                      <div className="flex items-center gap-1">
                        {renderStars(recipe.rating || 4.3)}
                        <span className="text-[10px] text-gray-500 ml-1">
                          {recipe.rating || 4.3}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {recipe.description || "No description available."}
                    </p>

                    {/* Meta Information - Time, Difficulty, and Cuisine/Category tag */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span className="font-medium">
                          {recipe.cookTime}
                        </span>
                        <span>•</span>
                        <span>{recipe.difficulty || "Easy"}</span>
                      </div>
                      {/* Category/Cuisine tag moved to bottom right */}
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-semibold rounded">
                        {recipe.category || "Recipe"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Recipes;