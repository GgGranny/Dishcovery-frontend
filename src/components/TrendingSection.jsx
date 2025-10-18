import React, { useState } from "react";
import "../css/TrendingSection.css";
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
      desc: "A combination of beaten rice, spiced meat, egg, and pickles served as a cultural feast.",
      time: "40 min",
      author: "Aryan Maharjan",
      rating: "4.9",
    },
    {
      id: 2,
      image: img2,
      title: "Jhol Momo",
      desc: "Steamed dumplings filled with juicy meat or vegetables, served with jhol and spicy chutney.",
      time: "30 min",
      author: "Abishek Rai",
      rating: "4.7",
    },
    {
      id: 3,
      image: img3,
      title: "Yomari",
      desc: "A steamed rice flour dumpling stuffed with chaku or khuwa, enjoyed especially during Yomari Punhi.",
      time: "20 min",
      author: "Nirjal Phasi",
      rating: "4.6",
    },
    {
      id: 4,
      image: img4,
      title: "Burger",
      desc: "Juicy patty layered with cheese, veggies, and sauces, all packed between soft buns.",
      time: "25 min",
      author: "Sagish Maharjan",
      rating: "4.8",
    },
    {
      id: 5,
      image: img5,
      title: "White Sauce Pasta",
      desc: "Pasta tossed in rich white sauce with herbs and vegetables for a delicious meal.",
      time: "15 min",
      author: "Kenji Tanaka",
      rating: "4.9",
    },
  ];

  const [index, setIndex] = useState(0);
  const visibleCards = 3; // show 3 at a time

  const nextSlide = () => {
    if (index < cards.length - visibleCards) setIndex(index + 1);
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <section className="trending-section">
      <h2>Trending This Week</h2>
      <p className="subtext">
        The most popular recipes our community is cooking right now
      </p>

      <div className="carousel-container">
        <button className="prev-btn" onClick={prevSlide} disabled={index === 0}>
          ‹
        </button>

        <div className="carousel-wrapper">
          <div
            className="carousel"
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {cards.map((card) => (
              <div key={card.id} className="carousel-card">
                <img src={card.image} alt={card.title} />
                <div className="card-content">
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <div className="card-footer">
                    <span>⏱ {card.time}</span>
                    <span>⭐ {card.rating}</span>
                    <span>👨‍🍳 {card.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="next-btn"
          onClick={nextSlide}
          disabled={index >= cards.length - visibleCards}
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default TrendingSection;
