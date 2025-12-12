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
  const [pageNo, setPageNo] = useState(1);

  const [filters, setFilters] = useState({
    category: [],
    difficulty: [],
    cuisine: [],
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
          `http://localhost:8080/api/recipes/recipe?page=${pageNo}&size=${9}`
        );
        const recipesArray = Array.isArray(res.data) ? res.data : [res.data];
        setRecipes(recipesArray);
        setFilteredRecipes(recipesArray);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Your session expired. Please log in again.");
        } else {
          setError("Failed to load recipes.");
        }
        console.error(err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token]);

  // Apply filters
  useEffect(() => {
    let filtered = [...recipes];

    if (filters.category.length > 0) {
      filtered = filtered.filter((r) => filters.category.includes(r.category));
    }
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter((r) =>
        filters.difficulty.includes(r.difficulty)
      );
    }
    if (filters.cuisine.length > 0) {
      filtered = filtered.filter((r) => filters.cuisine.includes(r.cuisine));
    }

    setFilteredRecipes(filtered);
  }, [filters, recipes]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const current = prev[type];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const resetFilters = () =>
    setFilters({ category: [], difficulty: [], cuisine: [] });

  return (
    <div className="w-full min-h-screen bg-white">
      <Homenavbar />

      {/* Banner */}
      <div
        className="relative w-full h-[260px] bg-cover bg-center"
        style={{ backgroundImage: `url(${recipeBg})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Discover Amazing Recipes</h1>
          <p className="text-lg">Explore delicious recipes from our community</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 py-10 px-5">
        {/* Filters */}
        <div className="col-span-3 space-y-6">
          {/* Category */}
          <div className="bg-[#EAF8EB] p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">Category</h2>
            {["Veg", "Non-Veg", "Nepali"].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-green-600"
                  checked={filters.category.includes(item)}
                  onChange={() => handleFilterChange("category", item)}
                />
                {item}
              </label>
            ))}
          </div>

          {/* Difficulty */}
          <div className="bg-[#EAF8EB] p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">Difficulty</h2>
            {["Easy", "Medium", "Hard"].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-green-600"
                  checked={filters.difficulty.includes(item)}
                  onChange={() => handleFilterChange("difficulty", item)}
                />
                {item}
              </label>
            ))}
          </div>

          {/* Cuisine */}
          <div className="bg-[#EAF8EB] p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">Cuisine</h2>
            {[
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
            ].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-green-600"
                  checked={filters.cuisine.includes(item)}
                  onChange={() => handleFilterChange("cuisine", item)}
                />
                {item}
              </label>
            ))}
          </div>

          <button
            className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg text-sm w-full hover:bg-gray-100 transition"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>

        {/* Recipe Cards */}
        <div className="col-span-9">
          {loading ? (
            <p className="text-center mt-10 text-gray-600">Loading recipes...</p>
          ) : error ? (
            <p className="text-center mt-10 text-red-500">{error}</p>
          ) : filteredRecipes.length === 0 ? (
            <p className="text-center mt-10 text-gray-600">No recipes found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.recipeId}
                  className="relative bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
                  onClick={() => navigate(`/aboutrecipes/${recipe.recipeId}`)}
                >
                  {/* Image */}
                  <div className="h-44 w-full overflow-hidden rounded-t-xl">
                    <img
                      src={
                        recipe.thumbnail
                          ? `data:image/jpeg;base64,${recipe.thumbnail}`
                          : "https://via.placeholder.com/300"
                      }
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">{recipe.recipeName}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                      {recipe.description || "No description available."}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {recipe.category || "Category"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {recipe.difficulty || "Easy"}
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
