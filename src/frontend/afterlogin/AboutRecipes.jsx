import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import authorImg from "../../assets/profile.jpg";
import { FaStar, FaRegStar } from "react-icons/fa";
import { AiFillFire } from "react-icons/ai";
import { GiKnifeFork } from "react-icons/gi";

const AboutRecipes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const token = localStorage.getItem("token");

  // Fetch recipe and comments
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

        // Parse steps
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

        // Fetch comments from backend
        const commentsRes = await axios.get(
          `http://localhost:8080/api/comments/c1/comment/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(commentsRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, token]);

  // Render ingredients
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

  // Render instructions
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

  const rating = 4.7;
  const reviews = 88;
  const totalStars = 5;

  // Submit comment
  const submitComment = async () => {
    if (!commentInput) return;
    try {
      const username = "Aryan"; // Replace with actual logged-in user
      await axios.post(
        `http://localhost:8080/api/comments/c1/comment`,
        null, // no body; backend uses query params
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            recipeId: id,
            content: commentInput,
            username,
          },
        }
      );

      setComments((prev) => [...prev, { comment: commentInput, user: username }]);
      setCommentInput("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit comment");
    }
  };

  if (loading)
    return (
      <div className="w-full min-h-screen bg-white">
        <Homenavbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm">Loading recipe...</p>
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
            <h2 className="text-xl font-bold text-red-500 mb-4">Oops!</h2>
            <p className="text-gray-600 mb-4">{error || "Recipe not found"}</p>
            <button
              onClick={() => navigate("/recipes")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Back to Recipes
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white text-gray-900">
      <Homenavbar />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.recipeName}</h1>
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              {[...Array(totalStars)].map((_, idx) =>
                idx < Math.floor(rating) ? (
                  <FaStar key={idx} className="text-yellow-400 text-base" />
                ) : (
                  <FaRegStar key={idx} className="text-gray-300 text-base" />
                )
              )}
              <span className="font-semibold ml-1">{rating.toFixed(1)}</span>
              <span>({reviews} Reviews)</span>
            </div>
            <p className="text-gray-700 text-sm">{recipe.description}</p>
          </div>

          {/* Image */}
          <div>
            {recipe.thumbnail ? (
              <img
                src={`data:image/jpeg;base64,${recipe.thumbnail}`}
                alt={recipe.recipeName}
                className="w-100 h-64 object-cover rounded-xl shadow"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                <GiKnifeFork className="text-gray-400 text-4xl" />
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-4">
              {["ingredients", "instructions", "video", "nutrients"].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 px-1 capitalize text-sm font-medium relative ${
                    activeTab === tab
                      ? "text-red-600 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {/* Ingredients & Comments */}
            {activeTab === "ingredients" && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
                  <h2 className="font-semibold mb-2">Ingredients</h2>
                  <ul className="space-y-2">
                    {renderIngredients().map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <input type="checkbox" className="w-4 h-4 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Comment Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
                  <h2 className="font-semibold mb-2">Comments</h2>
                  <textarea
                    placeholder="Write your comment..."
                    className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
                    rows={3}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <button
                    onClick={submitComment}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3 rounded"
                  >
                    Submit
                  </button>

                  {/* Display Comments */}
                  <div className="mt-4 space-y-2">
                    {comments.length === 0 ? (
                      <p className="text-gray-500 italic">No comments yet</p>
                    ) : (
                      comments.map((c, idx) => (
                        <div key={idx} className="border-b border-gray-100 py-2">
                          <p className="text-sm font-semibold">{c.user || "Anonymous"}</p>
                          <p className="text-sm text-gray-700">{c.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions Tab */}
            {activeTab === "instructions" && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
                <h2 className="font-semibold mb-2">Instructions</h2>
                <ul className="space-y-4">
                  {renderInstructions().map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Video & Nutrients Tabs */}
            {activeTab === "video" && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
                <h2 className="font-semibold mb-2">Video Tutorial</h2>
                {recipe.video ? (
                  <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black">
                    <video controls className="absolute top-0 left-0 w-full h-full" />
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No video available.</p>
                )}
              </div>
            )}

            {activeTab === "nutrients" && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
                <h2 className="font-semibold mb-2">Nutrition Facts</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(staticNutrients).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-2 rounded border border-gray-200 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        {(key === "Calories" && <AiFillFire className="text-red-600" />) ||
                          (key === "Protein" && <GiKnifeFork className="text-red-600" />)}
                        {key}
                      </span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center text-sm">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2">
              <img src={authorImg} alt="Author" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold">Hi! I'm ARYAN</h3>
            <p className="text-gray-600 text-xs mb-2">Nice to meet you!</p>
            <p className="text-gray-700 text-xs mb-2">Lorem ipsum dolor sit amet...</p>
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3 rounded">Learn More</button>
          </div>

          {/* Similar Recipes */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
            <h2 className="font-semibold mb-2">Similar Recipes</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gray-200 rounded overflow-hidden">
                    <img
                      src="https://via.placeholder.com/56"
                      alt={`Recipe ${item}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-sm truncate">Recipe Name {item}</p>
                    <p className="text-xs text-gray-500">30 mins • 4.5⭐</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutRecipes;
