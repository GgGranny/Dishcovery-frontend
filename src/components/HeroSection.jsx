
import "../css/HeroSection.css";
import heroBg from "../assets/hero-bg.png"; 

const HeroSection = () => {
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>
            Discover Delicious <br />
            Recipes from Around <br />
            the World
          </h1>
          <p>
            Join thousands of food lovers sharing their favorite recipes. Cook,<br/>
            share, and explore culinary delights.
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by ingredient, cuisine, or dish..."
            />
            <button>Explore Recipes</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
