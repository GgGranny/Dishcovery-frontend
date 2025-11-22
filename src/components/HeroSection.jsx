import heroBg from "../assets/hero-bg.png";

const HeroSection = () => {
  return (
    <section
      className="relative w-full min-h-[80vh] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-5 sm:px-8 md:px-12 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
          Discover Delicious <br className="hidden md:block" />
          Recipes from Around <br className="hidden md:block" />
          the World
        </h1>

        <p className="mt-4 text-base sm:text-lg opacity-90 max-w-lg">
          Join thousands of food lovers sharing their favorite recipes.
          Cook, share, and explore culinary delights.
        </p>

        {/* Search Bar */}
        <div className="mt-6 sm:mt-8 bg-white rounded-full flex flex-col sm:flex-row items-stretch sm:items-center overflow-hidden max-w-xl shadow-md">
          
          {/* Input */}
          <input
            type="text"
            placeholder="Search by ingredient, cuisine, or dish..."
            className="flex-1 px-4 py-3 text-gray-700 outline-none text-sm sm:text-base"
          />

          {/* Button */}
          <button className="px-6 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm sm:text-base">
            Explore Recipes
          </button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
