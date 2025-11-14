import React from "react";
import RecipeCard from "./RecipeCard";

import momoImg from "../assets/food2.png";
import thakaliImg from "../assets/thakali.png";
import newariImg from "../assets/food1.png";
import selrotiImg from "../assets/selroti.png";
import burgerImg from "../assets/food4.png";
import yomariImg from "../assets/food3.png";

const recipes = [
  {
    id: 1,
    title: "Chicken Momo",
    desc: "Steamed Nepali dumplings filled with juicy minced chicken, served with spicy tomato achar.",
    time: "30 min",
    rating: "4.9",
    author: "Chef Aarya",
    img: momoImg,
  },
  {
    id: 2,
    title: "Thakali Khana Set",
    desc: "Traditional Thakali platter with rice, dal, gundruk, pickles, vegetables, and grilled meat.",
    time: "35 min",
    rating: "4.8",
    author: "Chef Suman",
    img: thakaliImg,
  },
  {
    id: 3,
    title: "Newari Khaja Set",
    desc: "Authentic Newari feast including choila, bara, beaten rice, egg, and spicy pickles.",
    time: "40 min",
    rating: "4.9",
    author: "Chef Milan",
    img: newariImg,
  },
  {
    id: 4,
    title: "Sel Roti",
    desc: "Traditional homemade Nepali rice doughnut, crispy outside and soft inside.",
    time: "25 min",
    rating: "4.7",
    author: "Chef Bimala",
    img: selrotiImg,
  },
  {
    id: 5,
    title: "Burger",
    desc: "Tasty burger mad with crispy chicken and different tasty sauce.",
    time: "10 min",
    rating: "4.8",
    author: "Chef Anish",
    img: burgerImg,
  },
  {
    id: 6,
    title: "Yomari",
    desc: "Sweet Newari delicacy stuffed with chaku and sesame, steamed to perfection.",
    time: "45 min",
    rating: "4.9",
    author: "Chef Kriti",
    img: yomariImg,
  },
];

export default function FeaturedRecipes() {
  return (
    <section className="py-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">

      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
        Featured Recipes
      </h2>

      <p className="text-gray-600 text-center mb-10">
        Handpicked Nepali recipes prepared by our community's top home chefs
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-10">
        <button className="px-6 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition">
          View all
        </button>
      </div>

    </section>
  );
}
