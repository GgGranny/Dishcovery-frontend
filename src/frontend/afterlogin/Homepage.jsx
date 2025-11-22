import React from "react";

import heroBg from "../../assets/hero-bg.png";
import Homenavbar from "../../components/Homenavbar";
import TrendingSection from "../../components/TrendingSection";
import Footer from "../../components/Footer";

const Homepage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">

      {/* Navbar */}
      <Homenavbar />

      {/* HERO SECTION (Fully Fixed & Centered) */}
      <section
        className="relative w-full min-h-[80vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
              Discover Delicious <br /> Recipes from Around <br /> the World
            </h1>

            <p className="mt-4 text-lg opacity-90 text-white">
              Join thousands of food lovers sharing their favorite recipes.
              Cook, share, and explore culinary delights.
            </p>

            <div className="mt-8">
              <button className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold transition">
                Explore Recipes
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Trending Section */}
      <TrendingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
