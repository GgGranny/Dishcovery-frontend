import React from "react";
import Footer from "../components/Footer";
import recipeBg from "../assets/recipe-bg.png";
import Navbar from "../components/Navbar";

export default function Communities() {
  const [activeTab, setActiveTab] = React.useState("recent");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-[260px] bg-cover bg-center"
        style={{ backgroundImage: `url(${recipeBg})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Discover Amazing Recipes</h1>
          <p className="text-lg">Explore delicious recipes from our community</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex w-full max-w-7xl mx-auto mt-10 gap-6 px-4">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-5 rounded-2xl shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="cursor-pointer hover:text-green-600">All Discussions</li>
            <li className="cursor-pointer hover:text-green-600">Cooking Tips</li>
            <li className="cursor-pointer hover:text-green-600">Recipe Requests</li>
            <li className="cursor-pointer hover:text-green-600">Meal Planning</li>
            <li className="cursor-pointer hover:text-green-600">Baking Tips</li>
            <li className="cursor-pointer hover:text-green-600">Bread Making</li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-6 mb-6 text-lg font-medium">
            <button
              onClick={() => setActiveTab("recent")}
              className={
                activeTab === "recent"
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-600 hover:text-black"
              }
            >
              Recent Discussions
            </button>

            <button
              onClick={() => setActiveTab("popular")}
              className={
                activeTab === "popular"
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-600 hover:text-black"
              }
            >
              Popular This Week
            </button>

            <button
              onClick={() => setActiveTab("qa")}
              className={
                activeTab === "qa"
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-600 hover:text-black"
              }
            >
              Q&A
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">

            {/* ---------------- RECENT TAB ---------------- */}
            {activeTab === "recent" && (
              <>
                {/* Card 1 */}
                <div className="bg-white p-5 rounded-2xl shadow-md">
                  <span className="bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    Baking Tips
                  </span>
                  <p className="text-gray-500 text-sm mt-1">2 hours ago</p>
                  <h3 className="text-xl font-semibold mt-2">
                    Best substitutes for eggs in baking?
                  </h3>
                  <p className="text-gray-600 mt-1">
                    I'm trying to make my grandmother's cake recipe vegan-friendly. What are the
                    best egg substitutes that won't affect the texture?
                  </p>
                  <div className="mt-4 text-gray-700 text-sm">John Doe • 23 replies</div>
                  <button className="mt-3 text-green-600 hover:underline text-sm">
                    Join Discussion →
                  </button>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-5 rounded-2xl shadow-md">
                  <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    Meal Planning
                  </span>
                  <p className="text-gray-500 text-sm mt-1">4 hours ago</p>
                  <h3 className="text-xl font-semibold mt-2">
                    Weekly Meal Prep Ideas – Share Your Favorites!
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Looking for new meal prep ideas for busy weekdays. What are your go-to recipes
                    that reheat well?
                  </p>
                  <div className="mt-4 text-gray-700 text-sm">Sarah • 18 replies</div>
                  <button className="mt-3 text-green-600 hover:underline text-sm">
                    Join Discussion →
                  </button>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-5 rounded-2xl shadow-md">
                  <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    Bread Making
                  </span>
                  <p className="text-gray-500 text-sm mt-1">6 hours ago</p>
                  <h3 className="text-xl font-semibold mt-2">
                    Help! My sourdough starter isn’t bubbling
                  </h3>
                  <p className="text-gray-600 mt-1">
                    I've been feeding my starter for a week but it's not showing much activity. Any
                    troubleshooting tips?
                  </p>
                  <div className="mt-4 text-gray-700 text-sm">Emma Thompson • 34 replies</div>
                  <button className="mt-3 text-green-600 hover:underline text-sm">
                    Join Discussion →
                  </button>
                </div>
              </>
            )}

            {/* ---------------- POPULAR TAB ---------------- */}
            {activeTab === "popular" && (
              <>
                <div className="bg-white p-5 rounded-2xl shadow-md">
                  <span className="bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    Trending
                  </span>
                  <h3 className="text-xl font-semibold mt-2">
                    10 Most-Liked Dinner Recipes of the Week
                  </h3>
                  <p className="text-gray-600 mt-1">
                    These dinner ideas took the community by storm — quick, tasty, and healthy!
                  </p>
                  <div className="mt-4 text-gray-700 text-sm">148 likes • 52 comments</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-md">
                  <span className="bg-purple-200 text-purple-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    Hot Topic
                  </span>
                  <h3 className="text-xl font-semibold mt-2">
                    Is Air Frying Actually Healthier?
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Community members share research, comparisons, and honest opinions.
                  </p>
                  <div className="mt-4 text-gray-700 text-sm">93 likes • 27 comments</div>
                </div>
              </>
            )}

            {/* ---------------- Q&A TAB ---------------- */}
            {activeTab === "qa" && (
              <>
                <div className="bg-white p-5 rounded-2xl shadow-md">
                  <h3 className="text-xl font-semibold">How do I stop pasta from sticking?</h3>
                  <p className="text-gray-600 mt-1">Asked by: Ravi</p>
                  <p className="mt-1 text-gray-700">
                    I always end up with clumps. Any professional tips?
                  </p>
                  <button className="mt-3 text-green-600 hover:underline text-sm">Answer →</button>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-md">
                  <h3 className="text-xl font-semibold">Why is my cake sinking in the middle?</h3>
                  <p className="text-gray-600 mt-1">Asked by: Meera</p>
                  <p className="mt-1 text-gray-700">
                    Followed the recipe exactly, but still sinks. What am I doing wrong?
                  </p>
                  <button className="mt-3 text-green-600 hover:underline text-sm">Answer →</button>
                </div>
              </>
            )}

            {/* Load More Button */}
            <div className="flex justify-center mt-6">
              <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md font-semibold">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
