import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrendingSection = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const visibleCards = 3;

  const maxIndex = Math.max(0, recipes.length - visibleCards);

  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/recipes/recipe/featured-recipes?page=${page}&size=${size}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);

        // Spring Data Page or plain array
        const data = response.data.content || response.data;

        const mappedRecipes = data.map((recipe) => ({
          id: recipe.recipeId,
          image: recipe.thumbnail
            ? `data:image/jpeg;base64,${recipe.thumbnail}`
            : "/placeholder.jpg",
          title: recipe.recipeName,
          desc: recipe.description,
          time: `${recipe.cookTime} min`,
          author: recipe.username,
          rating: "4.5", // You can replace this with actual rating if exists
        }));

        setRecipes(mappedRecipes);
      } catch (error) {
        console.error("Failed to fetch featured recipes", error);
      }
    };

    fetchTrendingRecipes();
  }, [page, size]);


  useEffect(() => {
    console.log(" recipe: ", recipes);
  }, [recipes])
  return (
    <section className="text-center py-16 px-4 bg-white">
      <h2 className="text-3xl font-bold">Trending This Week</h2>
      <p className="text-gray-600 mt-2 mb-8">
        The most popular recipes our community is cooking right now
      </p>

      <div className="relative max-w-6xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="absolute -left-6 top-1/2 -translate-y-1/2 bg-black/10 text-2xl rounded-full w-11 h-11 flex items-center justify-center hover:bg-black/20 disabled:opacity-40 z-20"
        >
          ‹
        </button>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * (100 / visibleCards)}%)` }}
          >
            {recipes.length === 0 ? (
              <p className="text-gray-500">Loading trending recipes...</p>
            ) : (
              recipes.map((card) => (
                <div key={card.id} className="flex-none w-full md:w-1/2 lg:w-1/3 px-4" onClick={() => navigate(`/aboutrecipes/${card.id}`)}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-5 text-left">
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{card.desc}</p>

                      {/* Time + Author | Rating */}
                      <div className="flex justify-between items-start text-xs text-gray-700 mt-3">
                        <div className="flex flex-col gap-1">
                          <span>⏱ {card.time}</span>
                          <span>👨‍🍳 {card.author}</span>
                        </div>
                        <span className="font-semibold">⭐ {card.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
          disabled={index >= maxIndex}
          className="absolute -right-6 top-1/2 -translate-y-1/2 bg-black/10 text-2xl rounded-full w-11 h-11 flex items-center justify-center hover:bg-black/20 disabled:opacity-40 z-20"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default TrendingSection;
