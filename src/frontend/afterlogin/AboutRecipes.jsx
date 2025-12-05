import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import authorImg from "../../assets/profile.jpg";
import { FaStar, FaRegStar } from "react-icons/fa";

const AboutRecipes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8080/api/recipes/recipe/r1/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;

        // Parse steps safely
        let parsedSteps = [];
        if (data.steps) {
          if (Array.isArray(data.steps)) {
            parsedSteps = data.steps.flatMap((s) => {
              if (Array.isArray(s)) return s.map((step) => step.trim());
              if (typeof s === "string") return [s.trim()];
              return [];
            });
          } else if (typeof data.steps === "string") {
            parsedSteps = data.steps
              .split(/\n|[0-9]+\./)
              .map((s) => s.trim())
              .filter(Boolean);
          } else if (typeof data.steps === "object") {
            parsedSteps = Object.values(data.steps).flatMap((s) => {
              if (Array.isArray(s)) return s.map((step) => step.trim());
              if (typeof s === "string") return [s.trim()];
              return [];
            });
          }
        }

        parsedSteps = parsedSteps.map((step) =>
          step.replace(/^\[|\]$/g, "").replace(/^"|"$/g, "")
        );

        setRecipe({ ...data, parsedSteps });
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, token]);

  const renderIngredients = () => {
    if (!recipe) return [];
    if (Array.isArray(recipe.ingredients)) return recipe.ingredients;
    if (typeof recipe.ingredients === "string")
      return recipe.ingredients
        .split(/,|\n/)
        .map((i) => i.trim())
        .filter(Boolean);
    return ["No ingredients listed"];
  };

  const renderInstructions = () => {
    if (!recipe || !recipe.parsedSteps) return ["No instructions available"];
    return recipe.parsedSteps;
  };

  const staticNutrients = {
    Calories: "250 kcal",
    Protein: "10 g",
    Carbohydrates: "35 g",
    Fat: "8 g",
    Fiber: "5 g",
    Sugar: "7 g",
  };

  // Dummy rating (replace with real data if available)
  const rating = 4.2;
  const totalStars = 5;

  if (loading)
    return (
      <div className="w-full min-h-screen bg-white">
        <Homenavbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recipe...</p>
          </div>
        </div>
        <Footer />
      </div>
    );

  if (error || !recipe)
    return (
      <div className="w-full min-h-screen bg-white">
        <Homenavbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
            <p className="text-gray-600 mb-4">{error || "Recipe not found"}</p>
            <button
              onClick={() => navigate("/recipes")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Back to Recipes
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900">
      <Homenavbar />

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold leading-snug">{recipe.recipeName}</h1>
          <p className="text-gray-700 leading-relaxed">{recipe.description}</p>

          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-500">Submitted by:</span>
            <span className="font-semibold">{recipe.authorName || "Unknown"}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(totalStars)].map((_, idx) =>
              idx < Math.floor(rating) ? (
                <FaStar key={idx} className="text-yellow-400" />
              ) : (
                <FaRegStar key={idx} className="text-gray-400" />
              )
            )}
            <span className="ml-2 text-gray-600 font-medium">{rating.toFixed(1)}</span>
          </div>

          {/* Recipe Image */}
          {recipe.thumbnail && (
            <img
              src={`data:image/jpeg;base64,${recipe.thumbnail}`}
              alt={recipe.recipeName}
              className="w-full max-h-96 object-cover rounded-xl shadow-lg mt-4"
            />
          )}

          {/* Tabs */}
          <div className="flex gap-6 mt-6 border-b pb-2 text-gray-700 font-medium text-sm">
            {["ingredients", "instructions", "video", "nutrients"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 capitalize ${
                  activeTab === tab
                    ? "text-red-500 border-b-2 border-red-500 font-semibold"
                    : "hover:text-black"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6 space-y-6">
            {/* Ingredients */}
            {activeTab === "ingredients" && (
              <ul className="space-y-3 bg-white p-6 rounded-xl shadow">
                {renderIngredients().map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <input
                      type="checkbox"
                      className="mr-3 mt-1 w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Instructions */}
            {activeTab === "instructions" && (
              <ul className="space-y-3 bg-white p-6 rounded-xl shadow">
                {renderInstructions().map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <input
                      type="checkbox"
                      className="mr-3 mt-1 w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded"
                    />
                    <span className="font-semibold mr-2">{idx + 1}.</span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Video */}
            {activeTab === "video" && (
              <div className="bg-white p-6 rounded-xl shadow">
                {recipe.video ? (
                  <video controls className="w-full h-64 rounded-lg">
                    <source src={recipe.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-gray-700">No video available.</p>
                )}
              </div>
            )}

            {/* Nutrients */}
            {activeTab === "nutrients" && (
              <div className="bg-white p-6 rounded-xl shadow">
                <ul className="text-gray-700 space-y-2">
                  {Object.entries(staticNutrients).map(([key, value]) => (
                    <li key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Author & Details */}
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl shadow-lg border">
            <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-white shadow-md">
              <img src={authorImg} alt="Author" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-gray-800 text-xl">{recipe.authorName || "Author"}</h3>
            <p className="text-gray-600 text-sm mt-1">Top Chef</p>

            {/* Social Icons Placeholder */}
            <div className="flex gap-3 mt-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white p-4 rounded-xl shadow space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Cook Time:</span> {recipe.cookTime || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Category:</span> {recipe.category || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutRecipes;
