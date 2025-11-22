import React, { useState } from "react";
import img1 from "../assets/food1.png";
import img2 from "../assets/food2.png";
import img3 from "../assets/food3.png";
import img4 from "../assets/food4.png";
import img5 from "../assets/food5.png";

const TrendingSection = () => {
  const cards = [
    {
      id: 1,
      image: img1,
      title: "Newari Khaja Set",
      desc: "A combination of beaten rice, spiced meat, egg, and pickles.",
      time: "40 min",
      author: "Aryan Maharjan",
      rating: "4.9",
    },
    {
      id: 2,
      image: img2,
      title: "Jhol Momo",
      desc: "Steamed dumplings with jhol and spicy chutney.",
      time: "30 min",
      author: "Abishek Rai",
      rating: "4.7",
    },
    {
      id: 3,
      image: img3,
      title: "Yomari",
      desc: "Rice dumpling stuffed with chaku or khuwa.",
      time: "20 min",
      author: "Nirjal Phasi",
      rating: "4.6",
    },
    {
      id: 4,
      image: img4,
      title: "Burger",
      desc: "Juicy patty with cheese and veggies.",
      time: "25 min",
      author: "Sagish Maharjan",
      rating: "4.8",
    },
    {
      id: 5,
      image: img5,
      title: "White Sauce Pasta",
      desc: "Creamy white sauce pasta with herbs.",
      time: "15 min",
      author: "Kenji Tanaka",
      rating: "4.9",
    },
  ];

  const [index, setIndex] = useState(0);
  const visibleCards = 3;

  const maxIndex = Math.max(0, cards.length - visibleCards);

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

        {/* Carousel Viewport */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * (100 / visibleCards)}%)` }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex-none w-full md:w-1/2 lg:w-1/3 px-4"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1">
                  <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />

                  <div className="p-5 text-left">
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{card.desc}</p>

                    <div className="flex justify-between text-xs text-gray-700 mt-3">
                      <span>⏱ {card.time}</span>
                      <span>⭐ {card.rating}</span>
                      <span>👨‍🍳 {card.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
