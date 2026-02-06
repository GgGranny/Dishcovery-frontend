import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // State for saved recipes
  const [savedRecipes, setSavedRecipes] = useState(new Set());
  const [savingRecipeId, setSavingRecipeId] = useState(null);

  // Separate states for categories (Veg/Non-Veg) and cuisines (Newari, Tharu, etc.)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);

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
          `http://localhost:8080/api/recipes/recipe?page=${pageNo}&size=${10}`,
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
        
        // Fetch saved recipes for current user
        fetchSavedRecipes();
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

  // Fetch saved recipes for current user
  const fetchSavedRecipes = async () => {
    if (!token) return;
    
    try {
      const res = await axios.get(
        `http://localhost:8080/api/saved-recipes/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (res.data && Array.isArray(res.data)) {
        const savedRecipeIds = res.data.map(item => item.recipeId || item.recipe?.recipeId).filter(id => id);
        setSavedRecipes(new Set(savedRecipeIds));
        console.log("Saved recipes:", savedRecipeIds);
      }
    } catch (err) {
      console.error("Error fetching saved recipes:", err.response || err);
      // If endpoint doesn't exist or fails, we'll handle it gracefully
    }
  };

  // Handle save/unsave recipe
  const handleSaveRecipe = async (recipeId, e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!token) {
      setError("Please login to save recipes");
      return;
    }
    
    setSavingRecipeId(recipeId);
    
    try {
      if (savedRecipes.has(recipeId)) {
        // Unsave recipe
        await axios.delete(
          `http://localhost:8080/api/saved-recipes/${recipeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSavedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        // Save recipe
        await axios.post(
          `http://localhost:8080/api/saved-recipes/${recipeId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSavedRecipes(prev => new Set(prev).add(recipeId));
      }
    } catch (err) {
      console.error("Error saving/unsaving recipe:", err.response || err);
      setError("Failed to save recipe. Please try again.");
    } finally {
      setSavingRecipeId(null);
    }
  };

  // Apply filters to recipes
  const applyFilters = useCallback(() => {
    let filtered = [...recipes];

    // Filter by category (Veg/Non-Veg)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.category && selectedCategories.includes(recipe.category)
      );
    }

    // Filter by cuisine
    if (selectedCuisines.length > 0) {
      filtered = filtered.filter((recipe) => {
        if (recipe.cuisine) {
          return selectedCuisines.includes(recipe.cuisine);
        }
        if (recipe.category) {
          return selectedCuisines.includes(recipe.category);
        }
        return false;
      });
    }

    // Filter by difficulty
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.difficulty && selectedDifficulty.includes(recipe.difficulty)
      );
    }

    setFilteredRecipes(filtered);
  }, [selectedCategories, selectedCuisines, selectedDifficulty, recipes]);

  // Apply filters when filter states change
  useEffect(() => {
    if (!searchQuery.trim()) {
      applyFilters();
    }
  }, [selectedCategories, selectedCuisines, selectedDifficulty, recipes, searchQuery, applyFilters]);

  // Search recipes function
  const searchRecipes = async (query) => {
    if (!query.trim()) {
      // If search query is empty, reset to all recipes with filters
      applyFilters();
      setIsSearching(false);
      return;
    }

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/recipes/search?search=${encodeURIComponent(query)}&page=1&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      let searchResults = [];
      if (Array.isArray(res.data)) {
        searchResults = res.data;
      } else if (res.data.content) {
        searchResults = res.data.content;
      } else if (res.data.recipes) {
        searchResults = res.data.recipes;
      } else {
        searchResults = [res.data];
      }

      console.log("Search results:", searchResults);
      setFilteredRecipes(searchResults);
      setError(""); // Clear any previous errors
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Your session expired. Please log in again.");
      } else {
        setError("Failed to search recipes.");
      }
      console.error("Error searching recipes:", err.response || err);
    } finally {
      setIsSearching(false);
    }
  };

  // Custom debounce function
  const debounceSearch = useCallback((query) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      searchRecipes(query);
    }, 500); // 500ms delay
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      debounceSearch(query);
    } else {
      // If search query is cleared, reset to all recipes with filters
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      setIsSearching(false);
      applyFilters();
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
    setSearchQuery("");
    setFilteredRecipes(recipes);
    setIsSearching(false);
    
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  // Check if any filter is active
  const isFilterActive = selectedCategories.length > 0 ||
    selectedCuisines.length > 0 ||
    selectedDifficulty.length > 0 ||
    searchQuery.trim() !== "";

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
                {searchQuery.trim() !== "" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Search: "{searchQuery}"
                  </span>
                )}
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
          {/* Header with count and search bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {searchQuery.trim() !== "" 
                  ? `Search Results for "${searchQuery}"`
                  : isFilterActive
                  ? `Filtered Recipes (${filteredRecipes.length})`
                  : "All Recipes"}
              </h2>
              <span className="text-sm text-gray-500">
                {searchQuery.trim() !== ""
                  ? `Found ${filteredRecipes.length} recipes`
                  : isFilterActive
                  ? `Showing ${filteredRecipes.length} of ${recipes.length} recipes`
                  : `Total ${recipes.length} recipes`}
              </span>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recipes by name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg 
                    className="w-4 h-4 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  </div>
                )}
                {searchQuery && !isSearching && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      applyFilters();
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <svg 
                      className="w-4 h-4 text-gray-400 hover:text-gray-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
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
                {searchQuery.trim() !== ""
                  ? `No recipes found for "${searchQuery}"`
                  : isFilterActive
                  ? "No recipes match your selected filters"
                  : "No recipes available yet"}
              </p>
              {isFilterActive && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  {searchQuery.trim() !== "" ? "Clear Search" : "Clear Filters"}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.recipeId}
                  className="bg-white rounded-lg overflow-hidden border border-gray-400 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative group"
                  onClick={() => navigate(`/aboutrecipes/${recipe.recipeId}`)}
                >
                  {/* Recipe Image with Heart Icon */}
                  <div className="h-40 w-full overflow-hidden relative">
                    <img
                      src={
                        recipe.thumbnail
                          ? `data:image/jpeg;base64,${recipe.thumbnail}`
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    
                    {/* Heart Icon for Save/Unsave */}
                    <button
                      onClick={(e) => handleSaveRecipe(recipe.recipeId, e)}
                      disabled={savingRecipeId === recipe.recipeId}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg z-10"
                      aria-label={savedRecipes.has(recipe.recipeId) ? "Remove from saved recipes" : "Save recipe"}
                    >
                      {savingRecipeId === recipe.recipeId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : savedRecipes.has(recipe.recipeId) ? (
                        // Filled heart (saved)
                        <svg 
                          className="w-5 h-5 text-red-500" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        // Outline heart (not saved)
                        <svg 
                          className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                          />
                        </svg>
                      )}
                    </button>
                    
                    {/* Gradient overlay at bottom for better text visibility */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent"></div>
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
                        <svg 
                          className="w-3 h-3 mr-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        <span className="font-medium">
                          {recipe.cookTime}
                        </span>
                        <span>•</span>
                        <span>{recipe.difficulty || "Easy"}</span>
                      </div>
                      {/* Category/Cuisine tag */}
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