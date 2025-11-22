import React from "react";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative w-full h-48">
        <img
          src={recipe.img}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />

        {/* Favorite button */}
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-105 transition">
          ❤️
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 mb-1">
          {recipe.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4">{recipe.desc}</p>

        {/* Time + Rating */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <span>⏱</span>
            <span>{recipe.time}</span>
          </div>

          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{recipe.rating}</span>
          </div>
        </div>

        {/* Author */}
        <p className="text-xs text-gray-500">by {recipe.author}</p>
      </div>
    </div>
  );
}
