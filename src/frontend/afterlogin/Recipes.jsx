import React from "react";
import Homenavbar from "../../components/Homenavbar";
import Footer from "../../components/Footer";
import recipeBg from "../../assets/recipe-bg.png";

const Recipes = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <Homenavbar />

      {/* Banner */}
      <div
        className="relative w-full h-[260px] bg-cover bg-center"
        style={{ backgroundImage: `url(${recipeBg})` }}
      >
        <div className="absolute inset-0  bg-black/50 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Discover Amazing Recipes</h1>
          <p className="text-lg">Explore thousands of delicious recipes from our community</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 py-10 px-5">
        
        {/* Filters */}
        <div className="col-span-3 space-y-6">
          
          {/* Type Filter */}
          <div className="bg-[#EAF8EB] p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">Filter</h2>
            <div className="space-y-2">
              {["Veg", "Non-Veg"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-green-600" /> {item}
                </label>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div className="bg-[#EAF8EB] p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">Cuisine</h2>
            <div className="space-y-2 text-sm">
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
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-green-600" /> {item}
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="bg-[#EAF8EB] p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">Difficulty</h2>
            <div className="space-y-2 text-sm">
              {["Easy", "Medium", "Hard"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-green-600" /> {item}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg text-sm">
              Reset
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
              Show Results
            </button>
          </div>
        </div>

        {/* Recipe Cards */}
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition p-3 cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1601924582975-7aa6d1b90c05"
                  alt="Pizza"
                  className="rounded-lg mb-3 w-full h-36 object-cover"
                />
                <h3 className="font-semibold text-sm">
                  Margherita Pizza with Fresh Basil
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Classic Italian margherita pizza with homemade fresh
                  mozzarella, basil, and aromatic basil.
                </p>
                <div className="flex justify-between items-center text-xs text-gray-600 mt-3">
                  <span>⏱ 45 min</span>
                  <span>⭐ 4.9</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">By John Doe</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition">
              Load all recipes
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Recipes;
